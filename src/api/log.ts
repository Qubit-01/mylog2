import type { Log } from '@/types'
import request from '@/utils/request'

/**
 * 获取首页log列表
 * 传入skip和limit
 */
export const getLogsHome = (
    params: { skip: number, limit: number }
): Promise<Log[]> => {
    return request({
        url: "log/get_logs_home",
        method: "get",
        params,
    })
}

/**
 * 通过用户ID获取log列表，page参数必填
 * log/get_logs_by_userid?userid=1&skip=10&limit=5
 */
export const getLogsByUserid = (
    params: { userid: number, skip: number, limit: number }
): Promise<Log[]> => {
    return request({
        url: "log/get_logs_by_userid",
        method: "get",
        params,
    })
}

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getLogsAllByToken = (
    data: { token: string, skip?: number, limit?: number }
): Promise<Log[]> => {
    return request({
        url: "log/get_logs_all_by_token",
        method: "post",
        data,
    })
}

/**
 * 通过logid在public里面查找log
 * log/get_log_by_id?id=3584
 */
export const getLogById = (
    params: { id: number }
): Promise<Log> => {
    return request({
        url: "log/get_log_by_id",
        method: "get",
        params,
    })
}