import type { Log, LogEdit, LogFileItem, LogFilter } from '@/types'
import { myUploadFiles, myDeleteFiles, cosPath } from '@/utils/cos'
import COS from 'cos-js-sdk-v5'
import dayjs from 'dayjs'
import {
  getLogsHome,
  getLogsAllByToken,
  releaseLog,
  deleteLog,
  updateLog,
} from '@/api/log'
import useUserStore from './user'

const User = useUserStore()

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
  /**
   * 存储全部Log
   */
  listAll: Log[]
  /**
   * 存储全部Tag，日历的
   */
  tagsAll: Log[]
  /**
   * 过滤器
   */
  filter: LogFilter | undefined
  /**
   * 每次调用都会重置params，重新筛选
   * @param filter 过滤器
   */
  setFilter: (filter?: LogFilter) => void
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
   * 添加单个log，目前用于发布后。兼容Tag
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
   * 所以现在的逻辑是 先通过id找到这个元素，然后修改，如果修改了logtime再删除添加
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
      mylog.listFilter.slice(0, mylog.params.skip + mylog.params.limit)
    ),
    listAll: [],
    tagsAll: [],
    filter: undefined,
    listFilter: computed<Log[]>(() =>
      mylog.listAll.filter(log => {
        const f = filteLog(log, mylog.filter)
        // console.log(f, log)
        return f
      })
    ), // 由all筛选而来
    // 每次调用都会重置params，重新筛选
    setFilter: (filter?: LogFilter) => {
      mylog.loading = true
      mylog.params.skip = 0
      mylog.filter = filter
      mylog.addLogs()
    },
    params: { skip: 0, limit: 15 },
    loading: true,
    addLogs: async () => {
      mylog.loading = true
      mylog.params.skip += mylog.params.limit
      mylog.loading = false
    },
    getLogs: async () => {
      mylog.loading = true
      const logstags = await getLogsAllByToken({})
      const logs: Log[] = []
      const tags: Log[] = []
      // 划分 logs 和 tags
      logstags.forEach(log => {
        handleLog(log)
        log.type === 'tag' ? tags.push(log) : logs.push(log)
      })
      console.log('🐤1', logs, tags)
      mylog.listAll = logs
      mylog.tagsAll = tags
      mylog.addLogs() // 加载完成后立即加载几个数据
    },
    getLog: (id: string) => mylog.listAll.find(log => log.id === id),
    addLog(log: Log) {
      if (log.type === 'tag') {
        // 获取应该插入到的位置
        const index = mylog.tagsAll.findIndex(l => l.logtime <= log.logtime)
        // 如果没有找到（也就是新元素的 logtime 是最大的），就将新元素插入到列表的末尾
        if (index === -1) mylog.tagsAll.push(log)
        else mylog.tagsAll.splice(index, 0, log)
      } else {
        // 获取应该插入到的位置
        const index = mylog.listAll.findIndex(l => l.logtime <= log.logtime)
        // 如果没有找到（也就是新元素的 logtime 是最大的），就将新元素插入到列表的末尾
        if (index === -1) mylog.listAll.push(log)
        else mylog.listAll.splice(index, 0, log)
      }
    },
    delLog(id: string): Log {
      const index = mylog.listAll.findIndex(l => l.id === id)
      if (index === -1) {
        return mylog.tagsAll.splice(
          mylog.tagsAll.findIndex(l => l.id === id),
          1
        )[0]
      }
      return mylog.listAll.splice(index, 1)[0]
    },
    editLog(logEdit: Partial<Log>): Log {
      const log = mylog.getLog(logEdit.id!)!
      Object.assign(log, logEdit)
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

// 这里files必须放在最后，遍历时兜底
export const logFileItem: LogFileItem[] = ['imgs', 'videos', 'audios', 'files']

// 创造一个indexOf永远返回0的数组
const anyArray: string[] = []
anyArray.indexOf = () => 0
/**
 * 可以上传的文件类型
 */
export const fileType: { [K in LogFileItem]: string[] } = {
  imgs: ['image/png', 'image/gif', 'image/jpeg', 'image/jpg'],
  videos: ['video/mp4', 'video/quicktime'],
  audios: ['audios/mp3'], // 这里随便写的
  files: anyArray,
}

/**
 * 文件的大小限制
 */
export const fileSize: { [K in LogFileItem]: number } = {
  imgs: 10 * 1024 * 1024, // 图片大小限制，字节
  videos: 500 * 1024 * 1024, // 大小限制，字节
  audios: 100 * 1024 * 1024,
  files: 2000 * 1024 * 1024,
}

/**
 * 处理单个Log，直接操作参数
 * 1. 以前要转json,现在不用了
 * 2. 时间要处理, 用dayjs转
 */
export const handleLog = (log: any): void => {
  log.id = String(log.id)
  log.logtime = dayjs(log.logtime)
  log.sendtime = dayjs(log.sendtime)
}

/**
 * 发布Log时的，默认数据，兜底
 */
export const logInit: LogEdit = {
  type: 'log',
  // logtime: dayjs(), // 一般不用，他要自己算
  content: '',
  tags: [],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: [],
  people: [],
  info: {},
}

/**
 * 发布log，并上传文件，返回有正确id的log
 * @param log log对象，部分
 * @param file 要上传的文件
 */
export const rlsLog = (
  logEdit: LogEdit,
  params: COS.UploadFilesParams = { files: [] }
): Promise<Log | undefined> => {
  if (!logEdit.content) {
    ElMessage.error('必须填入内容哦')
    return Promise.reject(undefined)
  }
  // 填入必要数据：userid, username, sendtime
  // logtime没有就用当前默认
  const log: Log = Object.assign(
    {},
    logInit,
    {
      userid: User.id,
      username: User.name,
      sendtime: dayjs(),
      logtime: dayjs(),
    },
    logEdit
  ) as Log

  return myUploadFiles(params).then(data => {
    return releaseLog({ logJson: JSON.stringify(log) }).then(id => {
      if (id !== '0') {
        log.id = id
        logStore.mylog.addLog(log)
        ElMessage({ message: '发布成功：' + log.id, type: 'success' })
        return log
      }
    })
  })
}

/**
 * 编辑Log，先看文件，再编辑log
 * log只传入要修改的项（只有文件需要对比，要区分哪些文件需要删除和上传）
 * @param log 编辑的Log对象，这个里面的属性是log要最终成为的样子，不分添加或覆盖，id必传
 * @param params 可以不传，文件上传参数，{files[]文件列表，SliceSize? 触发分块的大小，onProgress? 进度条方法}
 * @returns 受影响log的条数
 */
export const editLog = (
  logEdit: LogEdit & { id: string },
  params: COS.UploadFilesParams = { files: [] }
): Promise<number> => {
  const logOld = logStore.mylog.getLog(logEdit.id)!

  // 记录一下要上传的文件的Key，后面要去除
  const uploadImgs = params.files.map(i => i.Key)

  // 筛选要删除的文件对象
  const delObjs: { Key: string }[] = []
  logFileItem.forEach(type => {
    if (logEdit[type]) {
      logOld[type]
        .filter(i => !logEdit[type]?.includes(i)) // 找old里面没有的
        .forEach(i => {
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
  console.log(logEdit, params, delObjs)
  // return Promise.resolve(1)

  return Promise.all([myDeleteFiles(delObjs), myUploadFiles(params)]).then(
    data => {
      return updateLog({ logJson: JSON.stringify(logEdit) }).then(count => {
        if (count === 1) {
          ElMessage({ message: '编辑成功', type: 'success' })
          logStore.mylog.editLog(logEdit)
        }
        return count
      })
    }
  )
}

/**
 * 删除Log，先删文件，再删log
 * @param log 删除的Log对象
 * @returns 参一为null，既成功
 */
export const delLog = async (log: Log): Promise<Log> => {
  if (log.type !== 'tag') {
    try {
      await ElMessageBox.confirm('确定删除吗？', '删除Log', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return log
    }
  }

  // 先删文件，再删log
  const objects: { Key: string }[] = []
  logFileItem.forEach(type => {
    log[type].forEach(i => {
      objects.push({ Key: `${cosPath()}${type}/${i}` })
      if (type === 'imgs')
        objects.push({ Key: `${cosPath()}compress-imgs/${i}` })
    })
  })

  return myDeleteFiles(objects)
    .then(data => {
      return deleteLog({ id: log.id! }).then(count => {
        ElMessage({ message: '删除成功', type: 'success' })
        logStore.mylog.delLog(log.id!)
        return log
      })
    })
    .catch(err => err)
}

/**
 * 传入一个log，返回布尔值
 * @param log Log对象
 * @param filter 过滤器对象
 * @return 为真就是满足，false就是不满足
 */
export const filteLog = (log: Log, filter?: LogFilter): boolean => {
  // 参二传入null，直接返回true
  if (!filter) return true

  // 记录状态
  if (filter.type !== '' && log.type != filter.type) return false

  // 时间限制，包含两头
  if (filter.timeLimit[0] && log.logtime.diff(dayjs(filter.timeLimit[0])) < 0)
    return false
  if (
    filter.timeLimit[1] &&
    log.logtime.diff(dayjs(filter.timeLimit[1])) > 86400000
  )
    return false

  // 排除
  if (filter.exclude.includes(log.id!)) return false

  const includes = (filter: string[], logV: string[], isOr: boolean) => {}

  if (filter.content.include.length) {
    const f = filter.content.isOr
      ? filter.content.include.some(c => log.content.includes(c))
      : filter.content.include.every(c => log.content.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  if (filter.people.include.length) {
    const f = filter.people.isOr
      ? filter.people.include.some(c => log.people!.includes(c))
      : filter.people.include.every(c => log.people!.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  if (filter.tags.include.length) {
    const f = filter.tags.isOr
      ? filter.tags.include.some(c => log.tags!.includes(c))
      : filter.tags.include.every(c => log.tags!.includes(c))
    if (f) {
      if (filter.isOrAll) return true
    } else {
      return false
    }
  }

  return true
}
