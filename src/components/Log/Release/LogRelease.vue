<script setup lang="ts">
import dayjs from 'dayjs'
import type { Log } from '@/types'
import { Bucket, Region } from '@/stores/constant'
import type { LogItem } from '../types'
import { rlsLog } from '@/stores/log'
import { cloneDeep } from 'lodash'
import { cosPath } from '@/utils/cos'

// 获取组件暴露的files，用于上传
const editImgs = ref()
const editVideos = ref()
const upload = reactive({
  percent: -1, // 上传进度
  speed: 0, // 上传速度 MB/s
})

// 编辑的数据
const logInit = (): Log => ({
  userid: '',
  username: '',
  type: 'log',
  sendtime: dayjs(),
  logtime: dayjs(),
  content: '',
  tags: [],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: [],
  people: [],
  info: {},
})
const logEdit = reactive<Log>(logInit())

// 编辑数据组件显示
const visibleInit = () => ({
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
const visible = reactive<{ [key in LogItem]?: boolean }>(visibleInit())

const release = () => {
  upload.percent = 0
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

  rlsLog(cloneDeep(logEdit), {
    files,
    onProgress: info => {
      upload.percent = Math.floor(info.percent * 100)
      upload.speed = +(info.speed / 1024 / 1024).toFixed(2)
    },
  }).then(log => {
    console.log(log)
    Object.assign(logEdit, logInit())
    Object.assign(visible, visibleInit())
    Object.assign(upload, { percent: -1, speed: 0 })
  })
}

/**
 * 新增且切换显示状态，这里不用考虑数据重置，因为组件在卸载钩子中会自动重置
 * @param item 设置项
 * @param data 如果不传入，则会切换显示状态，如果传入，则会设置数据
 */
const add = <T extends LogItem>(item: T, data?: Log[T]) => {
  if (data) {
    logEdit[item] = data
    visible[item] = true
  } else {
    visible[item] = !visible[item]
  }
}

defineExpose({ logEdit }) // 暴露数据给父组件用
</script>

<template>
  <div
    class="log-release"
    v-m
    :class="{ disabled: upload.percent > -1 }"
    @click.stop
  >
    <ElInput
      v-model="logEdit.content"
      :autosize="{ minRows: 3 }"
      type="textarea"
      placeholder="记录内容"
    />

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
        <ElButton size="small" type="primary" @click="release">发布</ElButton>
      </div>
    </div>

    <div v-if="visible.logtime">
      <EditTime v-model="logEdit.logtime" />
    </div>

    <div v-if="visible.tags">
      <EditTags v-model="logEdit.tags" />
    </div>

    <div v-if="visible.imgs">
      <EditImgs ref="editImgs" v-model="logEdit.imgs" :add />
    </div>

    <div v-if="visible.videos">
      <EditVideos ref="editVideos" v-model="logEdit.videos" />
    </div>

    <div v-if="visible.location">
      <EditLocation v-model="logEdit.location" />
    </div>

    <!-- <div v-m>logEdit: {{ logEdit }}</div>
    <div v-m>upload: {{ upload }}</div> -->
  </div>
</template>

<style scoped lang="less">
.log-release {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: sticky;
  top: var(--header-top);
  z-index: 20;

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
