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

const { log } = defineProps<{ log: Log }>()
// console.log(log)


// 双击log，展开和收起
const isExpand = ref(false)
const expand = () => {
  isExpand.value = !isExpand.value
  console.log(log)
}

document.querySelector()
</script>

<template>
  <div class="log" v-m @dblclick="expand">

    <!-- 标题 -->
    <div class="title" v-if="log.info?.title" v-overflow-ellipsis="isExpand ? 0 : 1">
      {{ log.info?.title }}
    </div>

  

    <!-- 内容 -->
    <div class="content">
      <!-- style="white-space: pre-wrap;display: inline;" -->
      <template v-if="isExpand">
        <span>{{ log.content }}</span>
      </template>
      <template v-else>
        <span v-overflow-ellipsis="3">{{ log.content }}</span>
        <span v-if="log.videos.length">&nbsp;🎬×{{ log.videos.length }}</span>
        <span v-if="log.files.length">&nbsp;📁×{{ log.files.length }}</span>
      </template>
    </div>

    <!-- 图片和视频放在一起 -->
    <div class="block-media" v-if="log.imgs.length">
      <ViewerImgs :files="log.imgs" />
      <ViewerVideos :files="log.videos" />
    </div>

    <!-- 音频 和 文件 -->
    <template v-if="isExpand">
      <div>
        音频：{{ log.audios }}
      </div>
      <div>
        视频：{{ log.files }}
      </div>
    </template>


    <div class="tags">
      <ElTag v-for="p in log.people" :key="p" size="small">{{ p }}</ElTag>
      <ElTag v-for="t in log.tags" :key="t" size="small">{{ t }}</ElTag>
      <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>

    </div>

    <div class="bottom">
      <div>{{ log.username }}</div>
      ·
      <el-tooltip effect="light" placement="top">
        <div>{{ log.logtime.format("YYYY-MM-DD HH:mm") }}</div>
        <template #content>
          发送时间：{{ log.sendtime.format("YYYY-MM-DD HH:mm") }}<br />
          记录时间：{{ log.logtime.format("YYYY-MM-DD HH:mm") }}
        </template>
      </el-tooltip>

      <template v-if="log.location.length">
        · <div>{{ log.location[1] }}</div>
      </template>

      <template v-if="log.info.link">
        · <a :href="log.info.link" target="_blank">查看原文</a>
      </template>
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

  .block-media {
    --block-height: 100px;
    --block-border-radius: 6px;
    --block-gap: 2px;

    display: flex;
    flex-wrap: wrap;
    gap: var(--block-gap);
  }

  .bottom {
    display: flex;
    gap: 4px;
  }
}
</style>