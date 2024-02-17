import type dayjs from "dayjs"

/**
 * Log的数据结构
 */
export interface Log {
  id?: string
  userid?: string
  username?: string
  type?: 'public' | 'log' | 'tag'
  sendtime?: dayjs.Dayjs // 发送时间
  logtime?: dayjs.Dayjs // 记录时间
  content: string
  tags?: string[]
  imgs?: string[]
  videos?: string[]
  audios?: string[]
  files?: string[]
  location?: [[number, number], string]
  people?: string[]
  info: {
    title?: string // log的标题
    link?: string // 爬虫数据的原始链接
    markdown?: boolean // 是否是MD类型
    level?: number // 待办优先级（这个功能待定）
  }
}

/**
 * 用户数据结构
 */
export interface User {
  id: number
  name: string
  img?: string
  info?: {
    userSex?: "男" | "女" | undefined
    userBirth?: string // 生日
    userText?: string // 个性签名

    stuId?: string // 学号
    stuClass?: string // 班级
  }
  setting: {
    isOK?: boolean // 不知道干嘛的
    note?: { // log设置集
      tags: string[] // 不知道干嘛的
      noteTags: string[] // 待选tag
      noteView: string // 默认视图
      calendarTags: string[] // 日历上的待选按钮
      diyLocations: [] // 不知道干嘛的
    }
    page: { // 页面设置
      theme?: string // 主题 light | dark
      backgroundImage?: string // 选中的背景图片
      diyBackgroundImage?: string // 自己添加的背景图片
    }
  }
  createtime?: Date
  openidQ?: string
  token?: string
}