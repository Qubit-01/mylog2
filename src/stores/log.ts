import type { Log } from '@/types'
import dayjs from 'dayjs'
import { getLogsHome as getLogs } from '@/api/log'
import Env from '@/stores/constant'

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

/**
 * 这里定个标准, 后端回传的log, 除了location都不能为null
 * 数组没有值就是 [], 对象没有值就是 {}
 * 时间前端要做一个处理
 */
export const useLogStore = defineStore('log', () => {
  // 首页的logs，每时每刻都是完好的数据
  const homeList = ref<Log[]>([])


  const params = reactive({ skip: 0, limit: 5 })
  const loading = ref(true)
  const getLogsHome = async () => {
    loading.value = true
    const data = await getLogs(params)
    data.forEach(handleLog)
    homeList.value = data
    loading.value = false
  }



  return { homeList, params, loading, getLogsHome }
})

export default useLogStore