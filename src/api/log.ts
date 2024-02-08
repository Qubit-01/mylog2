import type { Log } from '@/types'
import request from '@/utils/request'

/**
 * 获取首页log列表
 * 传入skip和limit
 */
export const getLogsHome = (
    params: { skip: number, limit: number } = { skip: 0, limit: 20 }
): Promise<Log[]> => {
    return request({
        url: "log/get_logs_home",
        method: "get",
        params,
    })
}
