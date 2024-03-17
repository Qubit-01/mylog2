<!-- 
  visible
    如果是boolean值，控制组件的显示和按钮的颜色
    如果是undefined，控制按钮有无
 -->
<script setup lang="ts">
import type { LogItem } from '../types'
import type { Log } from '@/types'
import {
  Document,
  Clock,
  PriceTag,
  Picture,
  VideoCamera,
  Microphone,
  FolderOpened,
  Location,
  User,
  More,
} from '@element-plus/icons-vue'

const { visible, add } = defineProps<{
  visible: { [key in LogItem]?: boolean }
  add: <T extends LogItem>(item: T, data?: Log[T]) => void
}>()

const map = {
  content: Document,
  logtime: Clock,
  tags: PriceTag,
  imgs: Picture,
  videos: VideoCamera,
  audios: Microphone,
  files: FolderOpened,
  location: Location,
  people: User,
  info: More,
}
</script>

<template>
  <div class="control-icons">
    <template v-for="(v, k) of map">
      <ElButton
        v-if="visible[k] !== undefined"
        link
        :icon="v"
        @click="add(k)"
        :type="visible[k] ? 'primary' : undefined"
      />
    </template>
  </div>
</template>

<style scoped lang="less">
.control-icons {
  display: flex;
  gap: 4px;

  > * {
    font-size: 24px;
    height: 24px;
    width: 24px;
    margin: 0;
  }
}
</style>
