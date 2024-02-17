import type { Log } from '@/types'
import dayjs from 'dayjs'
import { getLogsHome, getLogsAllByToken } from '@/api/log'
import Env from '@/stores/constant'
import useGlobalStore from './global'

// 请求响应
export type LogsResp = {
  list: Log[],
  params: { skip: number, limit: number },
  loading: boolean,
  addLogs?: () => Promise<void>, // 分页添加log
  getLogs?: () => Promise<void>, // 获取全部log
  [key: string]: any,
}

/**
 * 这里定个标准, 后端回传的log, 除了location都不能为null
 * 数组没有值就是 [], 对象没有值就是 {}
 */
export const useLogStore = defineStore('log', () => {
  const global = useGlobalStore()

  // 首页的logs，每时每刻都是完好的数据
  const home = reactive<LogsResp>({
    list: [],
    params: { skip: 0, limit: 10 },
    loading: false,
    addLogs: async () => {
      home.loading = true
      const data = await getLogsHome(home.params)
      data.forEach(handleLog)
      home.list.push(...data)
      home.params.skip += home.params.limit
      home.loading = false
    }
  })


  const mylog = reactive<LogsResp>({
    list: [],
    listAll: [],
    params: { skip: 0, limit: 50 },
    loading: false,
    addLogs: async () => {
      mylog.loading = true
      // const data = await getLogsAllByToken({ token: global.token, ...mylog.params })
      // data.forEach(handleLog)
      // mylog.list.push(...data)
      mylog.list.push(...mylog.listAll.slice(mylog.params.skip, mylog.params.skip + mylog.params.limit))
      mylog.params.skip += mylog.params.limit
      mylog.loading = false
    
    },
    // 获取所有mylog，要先清空数组
    getLogs: async () => {
      mylog.loading = true
      const logs = await getLogsAllByToken({ token: global.token })
      logs.forEach(handleLog)
      mylog.listAll = logs
      mylog.loading = false
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
 * 处理imgs地址，如果是http开头就直接用，否则加上OOS地址
 * 可以传入单个字符串，或者字符串数组
 * 全都要转为https，不改变log的源数据，只返回新的数组
 */
export const toFileUrl = <T extends string | string[]>(file: T, prefix: string = ''): T => {
  if (Array.isArray(file)) {
    return file.map(f => toFileUrl(f, prefix)) as T
  } else {
    if (file.indexOf('http') !== 0) file = `${Env.BucketURL}${prefix}/${file}` as T
    else file.replace('http://', 'https://')
    return file
  }
}