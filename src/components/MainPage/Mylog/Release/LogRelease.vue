<script setup lang="ts">
import dayjs from 'dayjs'
import type { Log } from '@/types'
import {
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
import useGlobalStore from '@/stores/global'
import type { LogItem } from './types'
// import COS from '@/utils/cos'
import { releaseLog } from '@/api/log'

const global = useGlobalStore()
// 获取组件暴露的files，用于上传
const editImgs = ref()


// 编辑的数据
const logEdit = reactive<Log>({
  userid: global.user.id,
  username: global.user.name,
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

// 编辑数据组件显示
const visible = reactive<{ [key in LogItem]: boolean }>({
  content: true,
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

const release = () => {
  // console.dir(COS)

  // 要先上传文件
  // console.log('上传文件', editImgs.value.files)

  releaseLog({ log: JSON.stringify(logEdit) }).then(id => {
    console.log('发布成功', id)
  })
}

/**
 * 新增且切换显示状态
 * @param item 设置项
 * @param data 如果不传入，则会切换显示状态，如果传入，则会设置数据
 */
const add = (item: LogItem, data: any = undefined) => {
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
  <div class="log-release" v-m>
    <ElInput
      v-model="logEdit.content"
      :autosize="{ minRows: 3 }"
      type="textarea"
      placeholder="记录内容"
    />

    <div class="icons">
      <ElButton
        link
        :icon="Clock"
        @click="add('logtime')"
        :type="visible.logtime ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="PriceTag"
        @click="add('tags')"
        :type="visible.tags ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="Picture"
        @click="add('imgs')"
        :type="visible.imgs ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="VideoCamera"
        @click="add('videos')"
        :type="visible.videos ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="Microphone"
        @click="add('audios')"
        :type="visible.audios ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="FolderOpened"
        @click="add('files')"
        :type="visible.files ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="Location"
        @click="add('location')"
        :type="visible.location ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="User"
        @click="add('people')"
        :type="visible.people ? 'primary' : undefined"
      />
      <ElButton
        link
        :icon="More"
        @click="add('info')"
        :type="visible.info ? 'primary' : undefined"
      />
    </div>

    <div class="edits">
      <div v-if="visible.logtime">
        <EditTime v-model="logEdit.logtime" />
      </div>

      <div v-if="visible.tags">
        <EditTags v-model="logEdit.tags" />
      </div>

      <div v-if="visible.imgs">
        <EditImgs ref="editImgs" v-model="logEdit.imgs" @add="add" />
      </div>

      <div v-if="visible.location">
        <EditLocation v-model="logEdit.location" />
      </div>

      <div>
        <ElButton size="small" type="primary" @click="release">发布</ElButton>
      </div>
    </div>
    <div v-m>logEdit: {{ logEdit }}</div>
  </div>
</template>

<style scoped lang="less">
.log-release {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 8px;

  .icons {
    display: flex;
    gap: 4px;

    > * {
      font-size: 24px;
      height: 24px;
      width: 24px;
      margin: 0;
    }
  }

  .edits {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
