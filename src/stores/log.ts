import type { Log } from '@/types'
import COS from 'cos-js-sdk-v5'
import { myUploadFiles, myDeleteFiles } from '@/utils/cos'
import dayjs from 'dayjs'
import {
  getLogsHome,
  getLogsAllByToken,
  releaseLog,
  deleteLog,
} from '@/api/log'
import useGlobalStore from './global'

const Global = useGlobalStore()

// 请求响应
export type LogsResp = {
  list: Log[] | globalThis.ComputedRef<Log[]>
  params: { skip: number; limit: number }
  loading: boolean
  addLogs?: () => Promise<void> // 分页添加log
  getLogs?: () => Promise<void> // 获取全部log
  [key: string]: any
}

// mylog的类型
interface Mylog extends LogsResp {
  listAll: Log[] // 存储全部Log
  addLog: (log: Log) => void
}

/**
 * 这里定个标准, 后端回传的log, 除了location都不能为null
 * 数组没有值就是 [], 对象没有值就是 {}
 */
export const useLogStore = defineStore('log', () => {
  // 首页的logs，每时每刻都是完好的数据
  const home = reactive<LogsResp>({
    list: [],
    params: { skip: 0, limit: 20 },
    loading: false,
    addLogs: async () => {
      home.loading = true
      const data = await getLogsHome(home.params)
      data.forEach(handleLog)
      home.list.push(...data)
      home.params.skip += home.params.limit
      home.loading = false
    },
  })

  const mylog: Mylog = reactive<Mylog>({
    list: computed<Log[]>(() =>
      mylog.listAll.slice(0, mylog.params.skip + mylog.params.limit)
    ),
    listAll: [],
    params: { skip: 0, limit: 20 },
    loading: false,
    addLogs: async () => {
      mylog.loading = true
      mylog.params.skip += mylog.params.limit
      mylog.loading = false
    },
    // 获取所有mylog，要先清空数组
    getLogs: async () => {
      mylog.loading = true
      const logs = await getLogsAllByToken({})
      logs.forEach(handleLog)
      mylog.listAll = logs
      mylog.loading = false

      mylog.addLogs!() // 加载完成后立即加载几个数据
    },
    // 添加单个Log，用于发布后
    addLog: (log: Log) => {
      mylog.listAll.push(log)
      mylog.listAll.sort((a: Log, b: Log) => b.logtime.diff(a.logtime))
    },
    // 删除单个log
    delLog: (id: string) => {
      mylog.listAll = mylog.listAll.filter(log => log.id !== id)
    },
  })

  return {
    home,
    mylog,
  }
})

export default useLogStore

/**
 * 处理单个Log，直接操作参数
 * 1. 以前要转json,现在不用了
 * 2. 时间要处理, 用dayjs转
 */
export const handleLog = (log: any): void => {
  log.logtime = dayjs(log.logtime)
  log.sendtime = dayjs(log.sendtime)
}

/**
 * 发布log，并上传文件，返回有正确id的log
 * @param log log对象本体
 * @param file 要上传的文件
 */
export const rlsLog = (
  log: Log,
  params: COS.UploadFilesParams
): Promise<Log> => {
  log.userid = Global.user.id
  log.username = Global.user.name
  return new Promise((resolve, reject) => {
    myUploadFiles(params).then(data => {
      releaseLog({ log: JSON.stringify(log) }).then(id => {
        log.id = id
        const logStore = useLogStore()
        logStore.mylog.addLog(log)
        ElMessage({ message: '发布成功：' + log.id, type: 'success' })
        resolve(log)
      })
    })
  })
}

/**
 * 删除Log，先删文件，再删log
 * @param log 删除的Log对象
 * @returns 参一为null，既成功
 */
export const delLog = (log: Log): Promise<[any, Log]> => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('确定删除吗？', '删除Log', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        // 先删文件，再删log
        const objects: { Key: string }[] = []
        log.imgs.forEach(i => {
          objects.push({ Key: `${Global.cosPath}imgs/${i}` })
          objects.push({ Key: `${Global.cosPath}compress-imgs/${i}` })
        })
        log.videos.forEach(v => {
          objects.push({ Key: `${Global.cosPath}videos/${v}` })
        })
        myDeleteFiles(objects).then(data => {
          deleteLog({ id: log.id! }).then(count => {
            ElMessage({ message: '删除成功', type: 'success' })
            const logStore = useLogStore()
            logStore.mylog.delLog(log.id)

            resolve([null, log])
          })
        })
      })
      .catch(() => {
        reject()
      })
  })
}
