import type { Log } from '@/types'
import request from '@/utils/request'
import useGlobalStore from '@/stores/global'

const global = useGlobalStore()

/**
 * 获取首页log列表
 * 传入skip和limit
 */
export const getLogsHome = (params: {
  skip: number
  limit: number
}): Promise<Log[]> => {
  return request({
    url: 'log/get_logs_home',
    method: 'get',
    params,
  })
}

/**
 * 通过用户ID获取log列表，page参数必填
 * log/get_logs_by_userid?userid=1&skip=10&limit=5
 */
export const getLogsByUserid = (params: {
  userid: number
  skip: number
  limit: number
}): Promise<Log[]> => {
  return request({
    url: 'log/get_logs_by_userid',
    method: 'get',
    params,
  })
}

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getLogsAllByToken = (data: {
  token?: string
  skip?: number
  limit?: number
}): Promise<Log[]> => {
  return request({
    url: 'log/get_logs_all_by_token',
    method: 'post',
    data: { token: global.token, ...data },
  })
}

/**
 * 通过logid在public里面查找log
 * log/get_log_by_id?id=3584
 */
export const getLogById = (params: { id: number }): Promise<Log> => {
  return request({
    url: 'log/get_log_by_id',
    method: 'get',
    params,
  })
}

/**
 * 新建log
 * @param data log要是json字符串
 * @returns 新建log的id
 */
export const releaseLog = (data: {
  token?: string
  logJson: string
}): Promise<string> => {
  return request({
    url: 'log/release_log',
    method: 'post',
    data: { token: global.token, ...data },
  })
}

/**
 * 编辑log
 * @param data log要是json字符串
 * @returns 编辑的条数
 */
export const editLog = (data: {
  token?: string
  logJson: string
}): Promise<number> => {
  return request({
    url: 'log/edit_log',
    method: 'post',
    data: { token: global.token, ...data },
  })
}

/**
 * 删除log
 * @param data log要是json字符串
 * @returns 删除的条数
 */
export const deleteLog = (data: {
  token?: string
  id: string
}): Promise<number> => {
  return request({
    url: 'log/delete_log',
    method: 'post',
    data: { token: global.token, ...data },
  })
}
