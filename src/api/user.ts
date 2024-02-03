import axios from 'axios'

/**
 * 通过用户名密码
 */
export const loginPswd = (name: string, pswd: string) => {
  return axios.post(
    "user/login_pswd",
    { name, pswd }
  )
}

