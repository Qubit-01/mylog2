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
import type { LogImgFile } from './types'

const global = useGlobalStore()

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

// 保存上传的文件对象
const logEditFiles = ref<{ imgs: LogImgFile[]; videos: LogImgFile[] }>({
  imgs: [],
  videos: [],
})

// 编辑数据组件显示
const editVisible = reactive({
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
  console.log('发布', logEdit)
}

const add = (item: keyof typeof editVisible) => {
  console.log('添加', item)
  editVisible[item] = !editVisible[item]
}

defineExpose({ logEdit }) // 暴露数据给父组件用
</script>

<template>
  <div class="log-release" v-m>
    <div v-m>logEdit: {{ logEdit }}</div>
    <!-- <div v-m>imgs: {{ logEdit.imgs }}</div> -->
    <!-- <div v-m>logEditFiles: {{ logEditFiles }}</div> -->

    <ElInput
      v-model="logEdit.content"
      :autosize="{ minRows: 3 }"
      type="textarea"
      placeholder="记录内容"
    />

    <div class="icons">
      <ElButton link :icon="Clock" @click="add('logtime')" />
      <ElButton link :icon="PriceTag" @click="add('tags')" />
      <ElButton link :icon="Picture" @click="add('imgs')" />
      <ElButton link :icon="VideoCamera" @click="add('videos')" />
      <ElButton link :icon="Microphone" @click="add('audios')" />
      <ElButton link :icon="FolderOpened" @click="add('files')" />
      <ElButton link :icon="Location" @click="add('location')" />
      <ElButton link :icon="User" @click="add('people')" />
      <ElButton link :icon="More" @click="add('info')" />
    </div>

    <div class="edits">
      <div>
        <EditTime v-model="logEdit.logtime" />
      </div>

      <div>
        <EditTags v-model="logEdit.tags" />
      </div>

      <div>
        <EditImgs
          v-model="logEdit.imgs"
          v-model:files="logEditFiles.imgs"
          v-model:logEdit="logEdit"
        />
      </div>

      <div>
        <EditLocation v-model="logEdit.location" />
      </div>
    </div>

    <div>
      <ElButton size="small" type="primary" @click="release">发布</ElButton>
    </div>
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
