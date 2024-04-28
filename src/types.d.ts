import type dayjs from 'dayjs'
import type { UploadFile, UploadRawFile } from 'element-plus'
import type { ExifImgFile } from '@/utils/img'

/**
 * 用户数据结构
 */
export interface User {
  id: string
  name: string
  img: string
  info: {
    sex?: '男' | '女' | undefined
    birth?: string // 生日
    text?: string // 个性签名

    stuId?: string // 学号
    stuClass?: string // 班级
  }
  setting: {
    page: {
      // 页面设置
      theme: string // 主题 light | dark
      backgroundImage?: string // 选中的背景图片
      diyBackgroundImage?: string // 自己添加的背景图片
    }
    mylog: {
      /**
       * 用户发布时待选tags
       */
      tags: string[]
      /**
       * 用户过滤器列表
       */
      filters: LogFilter[]
      /**
       * 默认筛选器的索引
       */
      filterIndex: number
      /**
       * 日历上的待选按钮
       */
      calendarTags: string[]
    }
    map: {
      diyPoints: {
        lnglat: [number, number]
      }[]
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
    source?: string // 爬虫数据的来源
  }
}

/**
 * 人脉的数据结构
 */
export interface Relation {
  id: string
  userid: string // 创建者
  username: string
  from: string // 前节点，这里用字符串转换判断是不是组节点
  name: string // 人的名字
  info: {
    // 一级放入系统要用的数据，键的名字由开发者设置，_other里面的由用户定义
    label?: string // 线条标签
    img?: string // 头像
    phone?: string // 手机号码
    _other: {
      [key in string]: any // 自定义项
    }
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
 * 编辑中的log类型，只能填入log属性
 */
export type RelationEdit = Partial<Relation>

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

/**
 * 过滤器对象
 */
interface LogFilter {
  name?: string
  type: '' | 'log' | 'public'
  /**
   * 时间限制，范围
   */
  timeLimit: [any | null, any | null]
  /**
   * 全部大筛选项都或运算
   */
  isOrAll: boolean
  content: {
    include: string[]
    isOr: boolean
  }
  people: {
    include: string[]
    isOr: boolean
  }
  tags: {
    include: string[]
    isOr: boolean
  }
  exclude: string[] // 排除，填入id
}
