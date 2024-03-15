import type { UploadFile, UploadRawFile } from 'element-plus'
import { ExifImgFile } from '@/utils/img'

/**
 * 继承 element 的 UploadRawFile，并加入EXIF信息
 */
export interface ExifUploadRawFile extends UploadRawFile, ExifImgFile {}

export interface LogFile extends UploadFile {
  key?: string // 文件名，上传时间-序号-文件名
}

export interface LogImgFile extends LogFile {
  raw?: ExifUploadRawFile
  compressImg?: ExifImgFile // 压缩文件
  compressImg95?: ExifImgFile // 95压缩文件
}

// 可以设置的项
export type LogItem =
  | 'content'
  | 'info'
  | 'logtime'
  | 'tags'
  | 'imgs'
  | 'videos'
  | 'audios'
  | 'files'
  | 'location'
  | 'people'
