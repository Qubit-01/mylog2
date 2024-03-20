<script setup lang="ts">
import type { LogItem } from '../types'
import type { Log } from '@/types'
import { editLog } from '@/stores/log'
import { Bucket, Region } from '@/stores/constant'
import { cosPath } from '@/utils/cos'
import { cloneDeep } from 'lodash'

const emit = defineEmits(['suc'])

// 获取组件暴露的files，用于上传
const editImgs = ref()
const editVideos = ref()

const log = inject<Log>('log')!
const logEdit = reactive<Partial<Log>>({})
const upload = reactive({
  percent: -1, // 上传进度
  speed: 0, // 上传速度 MB/s
})

// 编辑数据组件显示
const visibleInit = () => ({
  content: false,
  logtime: false,
  tags: false,
  imgs: false,
  videos: false,
  audios: false,
  files: false,
  location: false,
  people: false,
  info: false,
})
const visible = reactive<{ [key in LogItem]: boolean }>(visibleInit())

/**
 * 新增且切换显示状态
 * @param item 设置项
 */
const add = <T extends LogItem>(item: T, data?: Log[T]) => {
  if (data) {
    logEdit[item] = data
    visible[item] = true
    return
  }
  if (logEdit.hasOwnProperty(item)) {
    delete logEdit[item]
    visible[item] = false
  } else {
    logEdit[item] = cloneDeep(log[item])
    visible[item] = true
  }
}

const edit = () => {
  // 大压缩图、95压缩图、原图。大压缩图必发，95压缩图和原图选择性发送
  // 目前先实现发 大压缩图＋原图
  const files = []

  if (editImgs?.value?.files) {
    for (const file of editImgs.value.files) {
      files.push({
        // 大压缩图
        Bucket,
        Region,
        Key: `${cosPath()}compress-imgs/${file.key}`,
        Body: file.compressImg,
      })
      files.push({
        // 原图
        Bucket,
        Region,
        Key: `${cosPath()}imgs/${file.key}`,
        Body: file.raw,
      })
    }
  }

  if (editVideos?.value?.files) {
    for (const file of editVideos.value.files) {
      files.push({
        Bucket,
        Region,
        Key: `${cosPath()}videos/${file.key}`,
        Body: file.raw,
      })
    }
  }

  editLog(
    logEdit,
    {
      files,
      onProgress: (info) => {
        upload.percent = Math.floor(info.percent * 100)
        upload.speed = +(info.speed / 1024 / 1024).toFixed(2)
      },
    },
    log
  ).then((count) => {
    if (count === 1) emit('suc')
  })
}
</script>

<template>
  <div class="log-edit" :class="{ disabled: upload.percent > -1 }" @click.stop>
    <ElProgress
      v-if="upload.percent > -1"
      :percentage="upload.percent"
      :text-inside="true"
      :stroke-width="20"
      striped
    >
      {{ upload.percent }}% {{ upload.speed }}MB/s
    </ElProgress>

    <div v-else class="control">
      <ControlIcons :visible :add />

      <div class="rls-btn">
        <ElButton size="small" type="primary" @click="edit">编辑</ElButton>
      </div>
    </div>

    <div v-if="logEdit.hasOwnProperty('content')">
      <ElInput
        v-model="logEdit.content"
        :autosize="{ minRows: 3 }"
        type="textarea"
        placeholder="记录内容"
      />
    </div>

    <div v-if="logEdit.hasOwnProperty('logtime')">
      <EditTime v-model="logEdit.logtime!" edit />
    </div>

    <div v-if="logEdit.hasOwnProperty('tags')">
      <EditTags v-model="logEdit.tags!" edit />
    </div>

    <div v-if="logEdit.hasOwnProperty('imgs')">
      <EditImgs ref="editImgs" v-model="logEdit.imgs!" :add edit />
    </div>

    <div v-if="visible.videos">
      <EditVideos ref="editVideos" v-model="logEdit.videos!" edit />
    </div>

    <div v-if="visible.location">
      <EditLocation v-model="logEdit.location!" edit />
    </div>

    <!-- <div v-m>logEdit: {{ logEdit }}</div> -->
  </div>
</template>

<style scoped lang="less">
.log-edit {
  // 虚线边框
  border: 1px dashed #8888;
  border-radius: 8px;
  padding: var(--padding);

  display: flex;
  flex-direction: column;
  gap: 8px;

  .control {
    display: flex;
    justify-content: space-between;
  }
}

// 编辑不可操作时，如上传中
.disabled {
  pointer-events: none;
}
</style>
