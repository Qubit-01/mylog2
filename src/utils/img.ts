import EXIF from 'exif-js'

/**
 * 压缩图片
 * raw 6651136 6.35MB
   95 1500686 1.43MB
   20 80343 78.45KB
 * @param file 压缩文件
 * @param rate 压缩率，默认0.2
 * @returns
 */
export function compressImg(file: File, rate = 0.2): Promise<File> {
  function dataURLtoFile(dataurl: string, fileName: string) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)![1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  }

  let disposeFile = file

  // 如果是gif图片，不压缩
  if (file.type == 'image/gif') return Promise.resolve(file)

  if (Object.prototype.toString.call(file) === '[object Blob]') {
    disposeFile = new File([file], file.name, { type: file.type })
  }
  const read = new FileReader()
  // const fileSize = parseFloat(parseInt(disposeFile['size']) / 1048576).toFixed(
  //   2
  // )
  // 小于1m不压缩
  // if (fileSize < 1) return file;
  read.readAsDataURL(disposeFile)
  return new Promise((resolve, reject) => {
    try {
      read.onload = e => {
        const img = new Image()
        img.src = e.target!.result as string
        img.onload = function () {
          let w = Math.floor(img.width / 2)
          let h = Math.floor(img.height / 2)

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          let base64
          canvas.setAttribute('width', w.toString())
          canvas.setAttribute('height', h.toString())
          ctx!.drawImage(img, 0, 0, w, h)
          // console.log(w, h);
          base64 = canvas.toDataURL(disposeFile['type'], rate)

          let overImg = dataURLtoFile(base64, disposeFile.name)
          // console.log("压缩完成，压缩前：" + file.size / 1048576 + " 压缩后：" + overImg.size / 1048576)
          resolve(overImg)
        }
      }
    } catch (error) {
      reject(disposeFile)
    }
  })
}

// 文件URL转 File
// 输入url和文件名，，是异步操作
/**
 * 返回File对象
 * @param url 资源统一定位符
 * @param fileName 文件名，不传则从url中获取
 * @returns File对象Promise
 */
export function getFileByUrl(url: string, fileName?: string): Promise<File> {
  return new Promise((resolve, reject) => {
    let _fileName = fileName || url.split('/').pop()!
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Accept', 'image/png')
    xhr.responseType = 'blob'
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      let file = new File([xhr.response], _fileName, { type: 'image/png' })
      resolve(file)
    }
    xhr.onerror = reject
    // 发送
    xhr.send()
  })
}

/**
 * 在File类型基础上加入可选 exifdata 和 iptcdata 数据
 */
export interface ExifImgFile extends File {
  exifdata?: any
  iptcdata?: any
}

/**
 *提取EXIF信息，写入文件属性中，并返回
 * @param file
 * @return Promise<图片EXIF信息>
 */
export function getExifByFile(file: ExifImgFile): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      window.n = 0 // exif-js 自身的bug修复
      // @ts-ignore
      EXIF.getData(file, () => {
        resolve(EXIF.getAllTags(file))
      })
    } catch (e) {
      reject(e)
    }
  })
}

// 传入URL，返回图片EXIF信息
export function getExifFromURL(url: string) {
  return new Promise(() => {
    getFileByUrl(url).then(file => {
      return getExifByFile(file)
    })
  })
}
