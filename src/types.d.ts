import type dayjs from 'dayjs'
import type { UploadFile, UploadRawFile } from 'element-plus'
import type { ExifImgFile } from '@/utils/img'

/**
 * 用户数据结构
 */
export interface User {
  id: string
  name: string
  img?: string
  info?: {
    userSex?: '男' | '女' | undefined
    userBirth?: string // 生日
    userText?: string // 个性签名

    stuId?: string // 学号
    stuClass?: string // 班级
  }
  setting: {
    isOK?: boolean // 不知道干嘛的
    note?: {
      // log设置集
      tags: string[] // 不知道干嘛的
      noteTags: string[] // 待选tag
      noteView: string // 默认视图
      calendarTags: string[] // 日历上的待选按钮
      diyLocations: [] // 不知道干嘛的
    }
    page: {
      // 页面设置
      theme?: string // 主题 light | dark
      backgroundImage?: string // 选中的背景图片
      diyBackgroundImage?: string // 自己添加的背景图片
      source?: string // 爬虫数据的来源
    }
  }
  createtime?: Date
  openidQ?: string
  token?: string
}

/**
 * Log的数据结构
 * 都必须有，但是可以为空数组
 */
export interface Log {
  id?: string
  userid: string
  username: string
  type: 'public' | 'log' | 'tag'
  sendtime?: dayjs.Dayjs // 发送时间
  logtime: dayjs.Dayjs // 记录时间
  content: string
  tags: string[]
  imgs: string[]
  videos: string[]
  audios: string[]
  files: string[]
  location: [[number, number], string] | []
  people?: string[]
  info: {
    title?: string // log的标题
    link?: string // 爬虫数据的原始链接
    markdown?: boolean // 是否是MD类型
    level?: number // 待办优先级（这个功能待定）
  }
}

/**
 * 用户可以设置的项
 */
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

/**
 * log中代表文件的项，需要和COS交互的属性
 * 方便一些方法循环
 */
export type LogFileItem = 'imgs' | 'videos' | 'audios' | 'files'

type LogFileTypes = {
  imgs: LogImgFile[]
  videos: KeyFile[]
  audios: KeyFile[]
  files: KeyFile[]
}

/**
 * log上传前的文件类型要求（最后都是COS文件）
 */
export type LogFiles = {
  [K in LogFileItem]: LogFileTypes[K]
}

/**
 * 编辑中的log类型，只能填入log属性
 */
export type LogEdit = Partial<Log>

/**
 * 普通文件，加入上传要用的key，
 * key为：文件名，上传时间-序号-文件名，
 * 避免上传到COS时，文件名重复覆盖
 */
export interface KeyFile extends UploadFile {
  key?: string
}

/**
 * 图片文件：原图，压缩图，95压缩图
 */
export interface LogImgFile extends KeyFile {
  raw?: ExifUploadRawFile
  compressImg?: ExifImgFile // 压缩文件
  compressImg95?: ExifImgFile // 95压缩文件
}

/**
 * 结合 El的UploadRawFile 和 ExifImgFile，
 * 就是有EXIF信息的El Raw文件
 */
export interface ExifUploadRawFile extends UploadRawFile, ExifImgFile {}
