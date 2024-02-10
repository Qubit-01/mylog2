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


/**
 * 查用户名有没有，返回0或1，不区分大小写
 * 
 * @augments data { name: string }
 */
export const getHaveUser = (data: { name: string }): Promise<number> => {
  return request({
    url: "user/have_user",
    method: "get",
    params: data,
  })
}



/**
 * 注册 user/signin/signin
 * 用户ID  -1验证码错误 0用户名已存在
 * 
 * @augments data { name: string }
 */
export const signin = (data: { name: string, pswd: string, captcha: string }): Promise<number> => {
  return request({
    url: "user/signin/signin",
    method: "post",
    data,
  })
}

