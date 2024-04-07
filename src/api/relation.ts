import useGlobalStore from "@/stores/global"
import type { Relation } from "@/types"
import request from "@/utils/request"


const Global = useGlobalStore()

/**
 * 通过token获取log列表，全部
 * 不传page参数就返回全部
 * get_logs_all_by_userid
 */
export const getRelations = (data: { token?: string }): Promise<Relation[]> => {
  return request({
    url: 'relation/get_relations',
    method: 'post',
    data: { token: Global.token, ...data },
  })
}
