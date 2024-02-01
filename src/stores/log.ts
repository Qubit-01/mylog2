import axios from 'axios'
import type { Log } from '@/types'
import dayjs from 'dayjs'

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
 * 这里定个标准, 后端回传的log, 除了location都不能为null
 * 数组没有值就是 [], 对象没有值就是 {}
 * 时间前端要做一个处理
 */
export const useLogStore = defineStore('log', () => {
  // 首页的logs，每时每刻都是完好的数据
  const list = ref<Log[]>([])
  const params = reactive({ skip: 0, limit: 20 })
  const loading = ref(true)
  const getLogsHome = () => {
    loading.value = true
    axios.get('log/get_logs_home', { params })
      .then(res => {
        res.data.forEach(handleLog)
        list.value = res.data
        loading.value = false
      })
  }



  return { list, params, loading, getLogsHome }
})

export default useLogStore