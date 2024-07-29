# 什么是多元记？

你的手机中是否有一堆图片，既不想整理，也不肯删除？  
你的设备中是否有一堆文件，散落在各个文件夹中，想用时却找不到？  
数据格式多种多样，你想把文字、图片、视频等归纳到一起？  
数据要用到时，却后悔设备没带在身上？  
你是否纠结于各种网盘巨慢的下载速度？  
你是否想记录生活，却找不到合适的工具？  

那么**多元记**就是为你而生。

## 多元级做了什么？

多元记可以记录各种数据类型，将其绑定为条记录，并默认展示为一条时间线。

- 支持多种数据类型，包括文本、图片、视频、坐标、标签、文件、人员等。
- 对不同的数据类型提供了不同的展示方式，也提供了各种记录视图。
- 前沿的设计：毛玻璃、明暗主题切换、模块化扁平化设计。


**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
