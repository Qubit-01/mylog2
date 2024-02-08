import type { User } from '@/types'
import request from '@/utils/request'

/**
 * 通过用户名密码获取带token的用户信息
 * 
 * @augments data { name: string, pswd: string }
 */
export const loginPswd = (data: { name: string, pswd: string }): Promise<User> => {
  return request({
    url: "user/login_pswd",
    method: "post",
    data,
  })
}

/**
 * 通过token获取用户信息
 * 
 * @augments data { name: string, pswd: string }
 */
export const getUserByToken = (data: { token: string }): Promise<User> => {
  return request({
    url: "user/get_user_by_token",
    method: "post",
    data,
  })
}