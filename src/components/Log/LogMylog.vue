<!-- 
  MyLog和普通log有很多不同，但很多功能也要同步加入
 -->
<script setup lang="ts">
import type { Log } from '@/types'

const { log } = defineProps<{ log: Log }>()
// console.log(log)


// 双击log，展开和收起
const isExpand = ref(false)
const expand = () => {
  isExpand.value = !isExpand.value
  // console.log(log)
}
</script>

<template>
  <div class="log" v-m @click="expand">

    <!-- 标题 -->
    <div class="title" v-if="log.info?.title" v-overflow-ellipsis="isExpand ? 0 : 1">
      {{ log.info?.title }}
    </div>

    <!-- 内容 -->
    <div class="text">
      <pre class="content" v-overflow-ellipsis="isExpand ? 0 : 3" v-text="log.content"></pre>
    </div>

    <!-- 图片和视频放在一起 -->
    <div class="block-media" v-if="log.imgs.length">
      <ViewerImgs :files="log.imgs" />
      <ViewerVideos v-if="isExpand" :files="log.videos" /> <!-- v-if="isExpand" -->
    </div>

    <!-- 音频 和 文件 -->
    <template v-if="isExpand">
      <div v-if="log.audios.length">
        音频：{{ log.audios }}
      </div>
      <div v-if="log.audios.length">
        文件：{{ log.files }}
      </div>
    </template>

    <div class="tags">
      <ElTag v-if="log.type != 'log'" size="small" type="warning">公开</ElTag>
      <ElTag v-for="p in log.people" :key="p" size="small">{{ p }}</ElTag>
      <ElTag v-for="t in log.tags" :key="t" size="small" type="success">{{ t }}</ElTag>
      <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>

      <template v-if="!isExpand">
        <span v-if="log.videos.length">🎬{{ log.videos.length }}</span>
        <span v-if="log.audios.length">🎙️{{ log.audios.length }}</span>
        <span v-if="log.files.length">📁{{ log.files.length }}</span>
        <span v-if="log.location.length">📍</span>
      </template>
    </div>

    <div v-if="isExpand" class="bottom">
      <div>{{ log.username }}</div>
      ·
      <el-tooltip effect="light" placement="top">
        <div>{{ log.logtime!.format("YYYY-MM-DD HH:mm") }}</div>
        <template #content>
          发送时间：{{ log.sendtime!.format("YYYY-MM-DD HH:mm") }}<br />
          记录时间：{{ log.logtime!.format("YYYY-MM-DD HH:mm") }}
        </template>
      </el-tooltip> 

      <template v-if="log?.location?.length">
        · <div>{{ log.location[1] }}</div>
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

  .text {
    display: flex;
    flex-wrap: wrap;

    .content {
      width: fit-content;
      white-space: pre-wrap;
      // 继承父元素的字体
      font-family: unset;
    }
  }

  .block-media {
    --block-height: 100px;
    --block-border-radius: 6px;
    --block-gap: 2px;

    display: flex;
    flex-wrap: wrap;
    gap: var(--block-gap);
  }

  .tags {
    display: flex;
    gap: 4px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .bottom {
    display: flex;
    gap: 4px;
  }
}
</style>