<script setup lang="ts">
import dayjs from 'dayjs'
import type { UploadFiles } from 'element-plus'
import { fileType, logFileItem, type LogFileItem } from '@/stores/log'
import type { LogFile, LogItem } from '../types'
import type { Log } from '@/types'

// 文件名列表
const videos = defineModel<string[]>({ required: true })
// 外部传入的files，要朝里面放入cos文件对象。
const filesModel = defineModel<{ [key in LogFileItem]: LogFile[] }>('files', {
  required: true,
})

// 原有文件：编辑模块要传入一些图片进来
const videosOld = ref([...videos.value])
const { add, edit } = defineProps<{
  add: <T extends LogItem>(item: T, data?: Log[T]) => void
  edit?: boolean
}>()
let index = 1 // 计数，用于命名
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表
watch([videosOld, () => filesModel.value.videos.length], () => {
  videos.value = [
    ...videosOld.value,
    ...filesModel.value.videos.map(i => i.key!),
  ]
})

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: LogFile, files: UploadFiles) => {
  const raw = file.raw!

  // Todo: 判断大小还没做

  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = `${dayjs().format('YYMMDD_HHmmss')}-${index++}-${file.name}`

  // files 项的indexOf永远返回0，它一定会是最后兜底的
  for (const type of logFileItem) {
    if (fileType[type].indexOf(raw.type) > -1) {
      // 如果匹配到了其他类型，弹出后加进对应的filesModel
      if (type !== 'videos') {
        ElMessage('检测到非视频文件，已自动归类')
        add(type, [])
        filesModel.value[type].push(files.pop()!)
      }
      break // 匹配到了就要退出
    }
  }
}

const delVideoOld = (video: string) => {
  videosOld.value = videosOld.value.filter(i => i !== video)
}

onUnmounted(() => {
  if (!edit) videos.value = []
})
</script>
<template>
  <div class="edit-videos">
    <div class="all-videos">
      <div class="viewer-videos">
        <!-- 模仿element upload组件的卡片 -->
        <ul class="el-upload-list el-upload-list--text">
          <li
            v-for="video in videosOld"
            :key="video"
            class="el-upload-list__item is-ready"
          >
            <div class="el-upload-list__item-info">
              <a class="el-upload-list__item-name">
                <ElIcon><VideoCamera /></ElIcon>
                <span class="el-upload-list__item-file-name">{{ video }}</span>
              </a>
            </div>
            <ElIcon class="el-icon--close" @click="delVideoOld(video)"
              ><Close
            /></ElIcon>
          </li>
        </ul>
      </div>

      <!-- 真正上传的 drag -->
      <ElUpload
        v-model:file-list="filesModel.videos"
        class="upload-videos"
        multiple
        drag
        :on-change="onChange"
        :auto-upload="false"
      >
        点击或者拖拽到这里上传视频
        <!-- <ElButton type="primary">上传视频</ElButton> -->
        <!-- <template #file="{ file }">
          {{ file.url }}
        </template> -->
      </ElUpload>
    </div>
  </div>
</template>

<style scoped lang="less">
.edit-videos {
  --block-gap: 2px;

  .all-videos {
    display: flex;
    flex-direction: column;
    gap: var(--block-gap);

    .viewer-videos,
    .upload-videos {
      display: flex;
      flex-direction: column;
      gap: var(--block-gap);

      :deep(ul.el-upload-list) {
        margin: 0;
        display: flex;
        flex-direction: column;

        gap: var(--block-gap);
        > * {
          margin: 0;
        }

        &:empty {
          display: none;
        }
      }
    }

    .upload-videos {
      // 列表
      // :deep(ul.el-upload-list) {
      // }

      // 添加框
      :deep(.el-upload) {
        order: 1;

        .el-upload-dragger {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          height: 36px;
        }
      }
    }
  }
}
</style>
