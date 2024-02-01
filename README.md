# MyLog 2


使用 Vue3 + TS + Pinia + Element Plus 重构Mylog项目。  

My Multi Media Log 万象录 多元记 知行台
 

旧项目的缺陷：

- 不断开发功能，导致项目结构没有构思，乱。
- blog和note功能其实可以合成为一个功能，因为他们的功能和数据结构大致是相同的，note比blog更“大”，可以直接合成为一个功能，减少开发压力。
- 分享功能的id数组是明文的显示在url参数中，导致其他用户修改url参数中的id即可访问用户其他公开的log
- 点赞功能不好高性能得实现，2中采用空间换时间的方式，在两张表里面加入数据。

## 合并note表和blog表

以前主要是两张表存数据 note 和 blog:  
note有 id, userid, username, type, time, sendtime, content, imgs, videos, audios, files, location, people, tags, info  
blog有 id, userid, username, type, time,           content, data,                                         label, info, ~~tittle~~  

现在合并为一张表 log表，主要字段有：  
去除 tittle 字段，将其加入info中，原因：以前是为了 blog 好看设置了 tittle，现在发现不需要了  
以前blog的 label（就是分类：xy校园，js技术，qt其他，wx文学，yl娱乐），现在归为tags  
以前存储 json字符串 用的 mediumtext(16MB)，现在换成 json(支持4GB)  
type是log的类型，以前区分blog(null, md, pc)和note(tag，todo，null)，但是现在不区分blog和note了，所以取值: `null | md | pc | tag | todo | pulic`  

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

### Type字段
空: 以前直接blog发的，和note直接发的
pc: 爬虫爬取的数据
md: markdown类型的数据，标识content是markdown格式
public: 被选择公开的note
tag: 这是日历上的一个tag
todo: 废弃，以前是待办事项，应该加进log的tags中

现在

- public: 公开的log
- log: 普通的私有log
- tag： 日历的元素

注释

- md类型的，放在info中，markdown: true则为。
- 现在type不会为空，type默认都是log，爬虫的数据默认为public
- 现在首页展示 public


## 一些element的操作
```js
// main.ts 自定义主题css
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'  // 自己新建一个css文件，在官方的后面导入即可覆盖
html.dark { // 里面的样式自己覆盖
  --el-bg-color: #626aef; /* 自定义深色背景颜色 */
}
```


```css
// 模块
// 阿里云的毛玻璃
// 这是比较透的
    width: 368px;
    background: hsla(0,0%,100%,.4);
    border-radius: 16px;
    height: 200px;
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all .2s linear;
    box-shadow: 0 2px 16px 0 rgba(158,175,194,.08);
    align-items: center;
    backdrop-filter: blur(8px);



  // 这是不太透明的，就是前两个属性
    background: hsla(0,0%,100%,.92);
    box-shadow: none;

    cursor: pointer;
    width: 368px;
    border-radius: 16px;
    height: 200px;
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all .2s linear;
    align-items: center;
    backdrop-filter: blur(8px);

```