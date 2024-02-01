<!-- 
  几个注意点
  0. 首页展示和我的展示是否要一样? 待定
      首页要展示用户名, 而我的不用
      首页用发布时间排序, 我的用记录时间排序
  1. 标题有才显示
  2. 视频记录首帧, 展示在图片后面是最好的方式, 但工作量大
      现在采用更多来下拉展示
 -->
<script setup lang="ts">
import type { Log } from '@/types'

const { log } = defineProps<{
  log: Log
}>()
// console.log(log)


</script>

<template>
  <div class="log" v-m>
    <div class="title" v-if="log.info?.title">
      {{ log.info?.title }}
    </div>

    <div class="content">
      {{ log.content }}
    </div>

    <div class="imgs" v-if="log.imgs.length" v-m>
      <div v-for="i in log.imgs" key="i">{{ i }}</div>
    </div>


    <div>
      {{ log.username }} |
      {{ log.sendtime.format("YY-M-D H:mm") }}
      <template v-if="log.sendtime.diff(log.logtime, 'minutes')">
        | {{ log.logtime.format("YY-M-D H:mm") }}
      </template>


      <ElTag v-for="p in log.people" key="t" size="small">{{ p }}</ElTag>
      <ElTag v-for="t in log.tags" key="t" size="small">{{ t }}</ElTag>
      <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>
      <span v-if="log.location.length">{{ log.location[1] }}</span>
      <a v-if="log.info.link" :href="log.info.link" target="_blank">查看原文</a>

    </div>

    <div v-m>
      更多
      <div>{{ log.videos }}</div>
      <div>{{ log.audios }}</div>
      <div>{{ log.files }}</div>
    </div>

  </div>
</template>

<style scoped lang="less">
.log {
  border-radius: var(--border-radius);
  padding: var(--padding);

  .title {
    font-size: 1.2rem;
    font-weight: bolder;
  }
}
</style>