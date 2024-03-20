import type { Log } from '@/types'
import COS from 'cos-js-sdk-v5'
import { myUploadFiles, myDeleteFiles, cosPath } from '@/utils/cos'
import dayjs from 'dayjs'
import {
  getLogsHome,
  getLogsAllByToken,
  releaseLog,
  deleteLog,
  updateLog,
} from '@/api/log'
import useGlobalStore from './global'

const Global = useGlobalStore()

// 请求响应
export type LogsResp = {
  /**
   * 真正显示的数据
   */
  list: Log[] | globalThis.ComputedRef<Log[]>
  /**
   * 请求参数
   */
  params: { skip: number; limit: number }
  /**
   * 状态
   */
  loading: boolean
  /**
   * 分页添加log
   */
  addLogs: () => Promise<void>
  [key: string]: any
}

// mylog的类型
interface Mylog extends LogsResp {
  listAll: Log[] // 存储全部Log
  /**
   * 通过修改params参数，从listAll中截取，list会自动计算
   */
  addLogs: () => Promise<void>
  /**
   * 获取所有mylog，会直接覆盖listAll
   */
  getLogs: () => Promise<void>
  /**
   * 从all中获取真实的log对象
   * @param id log的id
   * @return 返回log对象，没找到就undefined
   */
  getLog: (id: string) => Log | undefined
  /**
   * 添加单个log，目前用于发布后
   * @param log log对象
   */
  addLog: (log: Log) => void
  /**
   * 删除单个log
   * @param id 删除的logid
   * @return 返回被删除的log
   */
  delLog: (id: string) => Log
  /**
   * 编辑单个log，逻辑是先删掉，浅覆盖，再添加
   * 这里发现一个很有趣的bug：
   * 原本的逻辑是，先从all中删除log，然后修改log，再把log加回去。
   * 但是vue看不到log的删除和添加，因为是同步代码，然而我在删除和添加的瞬间去修改了非key数据项
   * 完美避开了vue的响应式！diff算法发现id一样，不会去更新Dom
   * 所以现在的逻辑是 先通过id找到这个元素，然后修改，如果修改了logtime再删除条件
   * @param logEdit 一定要有id
   * @return 编辑的log
   */
  editLog: (logEdit: Partial<Log>) => Log
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

  /**
   * all在获取时就要排序，插入时就要插入到应有位置，避免sort耗费性能
   * 后端传来的数据就是排好的，前端插入逻辑尽量不用sort，编辑逻辑先删再插入
   * 删除逻辑也避免使用filter
   */
  const mylog: Mylog = reactive<Mylog>({
    list: computed<Log[]>(() =>
      mylog.listAll.slice(0, mylog.params.skip + mylog.params.limit)
    ),
    listAll: [],
    params: { skip: 0, limit: 15 },
    loading: false,
    addLogs: async () => {
      mylog.loading = true
      mylog.params.skip += mylog.params.limit
      mylog.loading = false
    },
    getLogs: async () => {
      mylog.loading = true
      const logs = await getLogsAllByToken({})
      logs.forEach(handleLog)
      mylog.listAll = logs
      mylog.loading = false
      mylog.addLogs!() // 加载完成后立即加载几个数据
    },
    getLog: (id: string) => mylog.listAll.find((log) => log.id === id),
    addLog(log: Log) {
      // 获取应该插入到的位置
      const index = mylog.listAll.findIndex((l) => l.logtime <= log.logtime)
      // 如果没有找到（也就是新元素的 logtime 是最大的），就将新元素插入到列表的末尾
      if (index === -1) mylog.listAll.push(log)
      else mylog.listAll.splice(index, 0, log)
    },
    delLog(id: string): Log {
      const index = mylog.listAll.findIndex((l) => l.id === id)
      return mylog.listAll.splice(index, 1)[0]
    },
    editLog(logEdit: Partial<Log>): Log {
      // 难道说不能直接操作对象？？？
      // const log = mylog.getLog(logEdit.id!)!
      const index = mylog.listAll.findIndex((log) => log.id === logEdit.id)
      const log = Object.assign(mylog.listAll[index], logEdit)
      // 如果修改的是logtime，就先删再加
      if (logEdit.logtime) mylog.addLog(mylog.delLog(log.id!))
      return log
    },
  })

  return {
    home,
    mylog,
  }
})

export default useLogStore

const logStore = useLogStore()

/**
 * log中代表文件的项，需要和COS交互的属性
 * 方便一些方法循环
 */
export const logFileType: ['imgs', 'videos', 'audios', 'files'] = [
  'imgs',
  'videos',
  'audios',
  'files',
]

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
    myUploadFiles(params).then((data) => {
      releaseLog({ logJson: JSON.stringify(log) }).then((id) => {
        if (id !== '0') {
          log.id = id
          logStore.mylog.addLog(log)
          ElMessage({ message: '发布成功：' + log.id, type: 'success' })
          resolve(log)
        }
      })
    })
  })
}

/**
 * 编辑Log，先看文件，再编辑log
 * 传入新旧log，新log只传入要修改的项，然后和旧log对比（只有文件需要对比，要区分哪些文件需要删除和上传）
 * @param log 编辑的Log对象，这个里面的属性是log要最终成为的样子，不分添加或覆盖
 * @param params 文件上传参数，{files[]文件对象列表，SliceSize? 触发分块的大小，onProgress? 进度条方法}
 * @param oldLog 旧log，主要用来比对文件
 * @returns 受影响log的条数
 */
export const editLog = (
  logEdit: Partial<Log>,
  params: COS.UploadFilesParams,
  logOld: Log
): Promise<number> => {
  return new Promise((resolve, reject) => {
    logEdit.id = logOld.id // id 必传

    // 记录一下要上传的文件的Key，后面要去除
    const uploadImgs = params.files.map((i) => i.Key)

    // 筛选要删除的文件对象
    const delObjs: { Key: string }[] = []
    logFileType.forEach((type) => {
      if (logEdit[type]) {
        logOld[type]
          .filter((i) => !logEdit[type]?.includes(i)) // 找old里面没有的
          .forEach((i) => {
            const Key = `${cosPath()}${type}/${i}`

            // 文件的键还不能是上传文件里面的
            if (!uploadImgs.includes(Key)) {
              delObjs.push({ Key })
              if (type === 'imgs')
                delObjs.push({ Key: `${cosPath()}compress-imgs/${i}` })
            }
          })
      }
    })

    return Promise.all([myDeleteFiles(delObjs), myUploadFiles(params)]).then(
      (data) => {
        console.log(data)
        if (!data[0][0] && !data[1][0])
          updateLog({ logJson: JSON.stringify(logEdit) }).then((count) => {
            if (count === 1) {
              ElMessage({ message: '编辑成功', type: 'success' })
              logStore.mylog.editLog(logEdit)
              resolve(count)
            }
          })
      }
    )
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
        logFileType.forEach((type) => {
          log[type].forEach((i) => {
            objects.push({ Key: `${cosPath()}${type}/${i}` })
            if (type === 'imgs')
              objects.push({ Key: `${cosPath()}compress-imgs/${i}` })
          })
        })
        myDeleteFiles(objects).then((data) => {
          deleteLog({ id: log.id! }).then((count) => {
            ElMessage({ message: '删除成功', type: 'success' })
            logStore.mylog.delLog(log.id!)
            resolve([null, log])
          })
        })
      })
      .catch(() => {
        // reject()
      })
  })
}
