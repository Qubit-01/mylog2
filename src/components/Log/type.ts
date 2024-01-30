export interface Log {
    id: string
    userid: string
    username: string
    type: 'public' | 'log' | 'tag'
    sendtime: Date // 发送时间
    logtime: Date // 记录时间
    content: string
    tags: string[]
    imgs: string[]
    videos: string[]
    audios: string[]
    files: string[]
    location: [[number, number], string]
    people: string[]
    info: {
        title?: string // log的标题
        link?: string // 爬虫数据的原始链接
        markdown?: boolean // 是否是MD类型
        level: number // 待办优先级（这个功能待定）
    }
}