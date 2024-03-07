import COS from 'cos-js-sdk-v5'
import request from '@/utils/request'
// import { baseURL, Bucket, Region } from '@/stores/constant'
import useGlobalStore from '@/stores/global'

const global = useGlobalStore()

/**
 * 获取临时密钥接口 API
 * @param data log要是json字符串
 * @returns 新建log的id
 */
const getCredential = (data?: { token?: string }): Promise<any> => {
  return request({
    url: 'cos/get_credential',
    method: 'post',
    data: { token: global.token, ...data },
  })
}

const cos = new COS({
  /**
   * 异步获取临时密钥 getAuthorization 必选参数
   * 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
   * @param options
   * @param callback
   */
  getAuthorization: function (options, callback) {
    getCredential().then(data => {
      if (!data) {
        console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
        return
      }

      callback({
        TmpSecretId: data.credentials.tmpSecretId,
        TmpSecretKey: data.credentials.tmpSecretKey,
        SecurityToken: data.credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      })
    })
  },
})

export default cos
