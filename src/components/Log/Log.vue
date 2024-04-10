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
import { Star, Share } from '@element-plus/icons-vue'
import { vOverflowEllipsis } from '@/utils/directives'

const router = useRouter()

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

// 双击log，展开和收起
const isExpand = ref(false)
const expand = () => {
  isExpand.value = !isExpand.value
}
</script>

<template>
  <div class="log" v-m @click="expand">
    <!-- 标题 -->
    <div
      class="title"
      v-if="log.info?.title"
      v-overflow-ellipsis="isExpand ? 0 : 1"
    >
      {{ log.info?.title }}
    </div>

    <!-- 内容 -->
    <div class="text">
      <pre
        class="content"
        v-overflow-ellipsis="isExpand ? 0 : 3"
        v-text="log.content"
      ></pre>
    </div>

    <!-- 图片和视频放在一起 -->
    <div class="block-media">
      <ViewerImgs v-if="log.imgs.length" :imgs="log.imgs" />
      <ViewerVideos v-if="log.videos.length && isExpand" :videos="log.videos" />
    </div>

    <!-- 音频 和 文件 -->
    <template v-if="isExpand">
      <div v-if="log.audios.length">音频：{{ log.audios }}</div>
      <div v-if="log.audios.length">文件：{{ log.files }}</div>
    </template>

    <div class="tags">
      <!-- <ElTag v-if="log.type === 'public'" size="small" type="warning">公开</ElTag> -->
      <ElTag v-for="p in log.people" :key="p" size="small">{{ p }}</ElTag>
      <ElTag v-for="t in log.tags" :key="t" size="small" type="success">
        {{ t }}
      </ElTag>
      <ElTag v-if="log.info.markdown" size="small">MarkDown</ElTag>

      <template v-if="!isExpand">
        <span v-if="log.videos.length">🎬×{{ log.videos.length }}</span>
        <span v-if="log.audios.length">🎙️×{{ log.audios.length }}</span>
        <span v-if="log.files.length">📁×{{ log.files.length }}</span>
      </template>
    </div>

    <div class="bottom">
      <div
        @click="router.push({ name: 'logger', query: { id: log.userid } })"
        style="cursor: pointer"
      >
        {{ log.username }}
      </div>
      ·
      <ElTooltip effect="light" placement="top">
        <div>{{ log.logtime.format('YYYY-MM-DD HH:mm') }}</div>
        <template #content>
          发送时间：{{ log.sendtime!.format('YYYY-MM-DD HH:mm') }}<br />
          记录时间：{{ log.logtime.format('YYYY-MM-DD HH:mm') }}
        </template>
      </ElTooltip>
      <template v-if="log.location.length">
        ·
        <div>{{ log.location[1] }}</div>
      </template>
      ·
      <div>{{ log.id }}</div>
      <template v-if="log.info.link">
        · <ElLink :href="log.info.link" target="_blank">查看原文</ElLink>
      </template>
    </div>

    <div v-if="isExpand" class="buttons">
      <ElButtonGroup>
        <ElButton :icon="Share" />
        <ElButton :icon="Star" />
        <!-- StarFilled -->
        <ElButton>
          <ElIcon><CaretTop /></ElIcon>0
        </ElButton>
      </ElButtonGroup>
    </div>

    <slot name="bottom"></slot>
  </div>
</template>

<style scoped lang="less">
.log {
  border-radius: var(--border-radius);
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 4px;

  // 空div应该不占用gap
  > div:empty {
    display: none;
  }

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
    --block-height: 6rem;
    --block-border-radius: 6px;
    --block-gap: 2px;

    display: flex;
    flex-wrap: wrap;
    gap: var(--block-gap);
  }

  .tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .bottom {
    display: flex;
    gap: 4px;
    font-size: 0.9rem;
    color: var(--color-2);
  }

  .buttons {
    position: absolute;
    top: -26px;
    right: var(--padding);
  }
}
</style>
