import COS from 'cos-js-sdk-v5'
import request from '@/utils/request'
import { Bucket, Region, BucketCDN } from '@/stores/constant'
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


  // 用户的cos路径方便后续使用
  const cosPath = computed(() => `users/${user.id}/mylog/`)

/**
 * 处理imgs地址，如果是http开头就直接用，否则加上OOS地址
 * 可以传入单个字符串，或者字符串数组
 * 全都要转为https，不改变log的源数据，只返回新的数组
 * @param file 文件名或文件对象
 * @param prefix CDN域名 prefix 文件名
 */
export const toFileUrl = <T extends string | string[]>(
  file: T,
  prefix: string = ''
): T => {
  if (Array.isArray(file)) {
    return file.map(f => toFileUrl(f, prefix)) as T
  } else {
    if (file.indexOf('http') !== 0) file = `${BucketCDN}${prefix}${file}` as T
    else file.replace('http://', 'https://')
    return file
  }
}






// 获取文件列表
// cos.getBucket(
//   {
//     Bucket,
//     Region,
//     Prefix: 'note-imgs/',
//     Marker: 'note-imgs/230513_0143-26-BIT08355.jpg',
//     // note-imgs/1666848767959-1.jpg
//     // note-imgs/230513_0143-26-BIT08355.jpg

//   },
//   function (err, data) {
//     a = data.Contents.map(i => i.Key)
//     console.log(a)
//   }
// )

// 复制对象到
//   cos.putObjectCopy(
//     {
//       Bucket,
//       Region,
//       Key: 'users/1/mylog/imgs/' + CopySource.split('/')[1],
//       // https://bit-1310383539.cos.ap-chengdu.myqcloud.com/web-files/README.md
//       // CopySource:
//       //   'bit-1310383539.cos.ap-chengdu.myqcloud.com/' + CopySource, // note-imgs/1666848261375-0.jpg
//       /* CopySource中的Key含中文时，需要自行转义 */
//       CopySource: `bit-1310383539.cos.ap-chengdu.myqcloud.com/${encodeURIComponent(CopySource)}`,
//     },
//     function (err, data) {
//       console.log(CopySource)
//       console.log(err || data)
//     }
//   )
// }

/**
 * 自己封装的文件上传方法
 * 如果传入空files，就直接返回一个成功的Promise
 * @param params 文件上传参数
 * @returns Promise
 */
export const myUploadFiles = (
  params: COS.UploadFilesParams
): Promise<[COS.CosError, COS.UploadFilesResult]> => {
  return new Promise((resolve, reject) => {
    // 没有文件，直接返回成功
    if (params.files.length === 0) return resolve([null, { files: [] }])

    cos.uploadFiles(
      {
        SliceSize: 1024 * 1024 * 5,
        onProgress: function (info) {
          var percent = info.percent * 100
          var speed = info.speed / 1024
          console.log('进度：' + percent + '%; 速度：' + speed + 'KB/s')
        },
        ...params,
      },
      (err, data) => {
        // 所有上传完成后的回调
        resolve([err, data])
      }
    )
  })
}

/**
 * 自己封装的文件删除方法
 * @param objects 传入形如 { Key: '1.jpg' } 的数组
 */
export const myDeleteFiles = (
  Objects: { Key: string }[]
): Promise<[COS.CosError, COS.DeleteMultipleObjectResult]> => {
  return new Promise((resolve, reject) => {
    if (Objects.length === 0) return resolve([null, { Deleted: [], Error: [] }])
    cos.deleteMultipleObject(
      {
        Bucket,
        Region,
        Objects,
      },
      (err, data) => {
        resolve([err, data])
      }
    )
  })
}
