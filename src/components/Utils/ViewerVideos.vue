<script setup lang="ts">
import { toFileUrl } from '@/utils/cos'
import type { Log } from '@/types'

// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!

/**
 * files是视频列表
 */
const props = defineProps<{ videos: string[] }>()

// 传入的文件要处理，如果不是http开头，那么就加上OOS地址，否则直接用，而且要改为https
const videos = ref<string[]>(toFileUrl(props.videos, 'videos/', log.userid))

watchEffect(()=>{
  console.log('🐤v change', videos.value)
})

// 当前播放的是视频地址
const videoSrc = ref('')
</script>

<template>
  <div class="viewer-videos">
    <div
      v-for="video in videos"
      :key="video"
      class="video"
      @click.stop="videoSrc = video"
    >
      <video>
        <source :src="video" />
      </video>
      <VideoPlay class="video-icon" />
    </div>
  </div>

  <!-- 真正用来播放的 -->
  <TeleportBody v-if="videoSrc" @close="videoSrc = ''">
    <!--
        autoplay 自动开始播放 controls 显示播放器控件
        poster 视频封面 loop 循环播放
        muted 默认静音 preload 页面加载时加载，并预备播放
        none:播放前不会预先下载视频资源，用户不点击播放时会省宽带；
        metadata:播放前不会下载视频资源，但是会获取资源的元数据；
        auto:根据实际情况动态决定
      -->
    <video class="video-play" controls autoplay ref="videoDom">
      <source :src="videoSrc" type="video/mp4" />
    </video>
  </TeleportBody>
</template>

<style scoped lang="less">
.viewer-videos {
  white-space: nowrap;
  overflow-y: hidden;
  width: fit-content;
  max-width: 100%;

  display: flex;
  gap: var(--block-gap);

  .video {
    position: relative;
    height: var(--block-height);

    video {
      object-fit: cover;
      height: var(--block-height);
      width: var(--block-height);
      border-radius: var(--block-border-radius);
    }

    // 图标
    .video-icon {
      position: absolute;
      color: white;
      opacity: 0.5;
      width: 50px;
      height: 50px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &:hover .video-icon {
      opacity: 1;
    }
  }
}

.video-play {
  max-height: 90vh;
  max-width: 90vw;
}
</style>
