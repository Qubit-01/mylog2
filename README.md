# MyLog 2

使用 Vue3 + TS + Pinia + Element Plus 重构 Mylog 项目。

网站名称待定： My Multi Media Log 万象录 多元记 知行台
网站域名待定： pro(已被注册)、ink、pub、run、plus

# 架构

```js
// 主题css，暂时不开发
./assets/css/themes/dark.css
// 基础css，定义了全局css变量、明暗主题、m模块的样式
./assets/css/base.less
// 里面就一个RouterView，整个页面的路由，其中的js部分是加载页面后必须执行的
// 如 User 请求，主题设置
App.vue

```

旧项目的缺陷：

- 不断开发功能，导致项目结构没有构思，乱。
- blog 和 note 功能其实可以合成为一个功能，因为他们的功能和数据结构大致是相同的，note 比 blog 更“大”，可以直接合成为一个功能，减少开发压力。
- 分享功能的 id 数组是明文的显示在 url 参数中，导致其他用户修改 url 参数中的 id 即可访问用户其他公开的 log
- 点赞功能不好高性能得实现，2 中采用空间换时间的方式，在两张表里面加入数据。

## 合并 note 表和 blog 表

以前主要是两张表存数据 note 和 blog:  
note 有 id, userid, username, type, time, sendtime, content, imgs, videos, audios, files, location, people, tags, info  
blog 有 id, userid, username, type, time, content, data, label, info, ~~tittle~~

现在合并为一张表 log 表，主要字段有：  
去除 tittle 字段，将其加入 info 中，原因：以前是为了 blog 好看设置了 tittle，现在发现不需要了  
以前 blog 的 label（就是分类：xy 校园，js 技术，qt 其他，wx 文学，yl 娱乐），现在归为 tags  
以前存储 json 字符串 用的 mediumtext(16MB)，现在换成 json(支持 4GB)  
type 是 log 的类型，以前区分 blog(null, md, pc)和 note(tag，todo，null)，但是现在不区分 blog 和 note 了，所以取值: `null | md | pc | tag | todo | pulic`

```sql
id bigint 唯一标识log,
userid bigint 对应的用户id,
username varchar(255) 对应的用户名,
type varchar(50) log的类型，区分blog(null, md, pc)和note(tag，todo，null),
sendtime datetime 发送时间,
logtime datetime 发生时间,
content longtext 内容,
tags json 标签数组，包括blog的分类,
imgs json 图片数组,
videos json,
audios json,
files json,
location json,
people json,
info json 包含一些杂项，不太会用它筛选，不会操作它（要操作就整体操作），归为一个json。如tittle,
```

## 注意点

### Type 字段

空: 以前直接 blog 发的，和 note 直接发的
pc: 爬虫爬取的数据
md: markdown 类型的数据，标识 content 是 markdown 格式
public: 被选择公开的 note
tag: 这是日历上的一个 tag
todo: 废弃，以前是待办事项，应该加进 log 的 tags 中

现在

- public: 公开的 log
- log: 普通的私有 log
- tag： 日历的元素

注释

- md 类型的，放在 info 中，markdown: true 则为。
- 现在 type 不会为空，type 默认都是 log，爬虫的数据默认为 public
- 现在首页展示 public

## 一些 element 的操作

```js
// main.ts 自定义主题css
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'  // 自己新建一个css文件，在官方的后面导入即可覆盖
html.dark { // 里面的样式自己覆盖
  --el-bg-color: #626aef; /* 自定义深色背景颜色 */
}
```

# COS

文件结构：[用户 id]/[项目]/不同类型文件夹/时间戳-源文件名
不同类型文件夹：compress-imgs, note-audios, note-files, note-imgs, note-videos, recycle, web-files

users/1/mylog/compress-imgs/1666071890799-0.jpg

读取：配置了 CDN，现在读取文件只能通过 CDN，只能通过 mylog.cool 读取。并且没有对权限进行限制
