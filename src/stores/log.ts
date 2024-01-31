import axios from 'axios'
import type { Log } from '@/types'

export const initLog = {
  tags: [],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: undefined,
  people: [],
  info: {}
}
/**
 * 
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
        // console.log(res.data[2])
        // res.data.forEach(handleLog)
        list.value = res.data
        // console.log(res.data[1])
        loading.value = false
      })
  }

  /**
   * 处理单个Log，直接操作参数
   * 1. 解析 info字符串
   */
  const handleLog = (log: any): void => {
    if (log.info) log.info = JSON.parse(log.info)
    log = { ...initLog, ...log }
  }
  return { list, params, loading, getLogsHome }
})
