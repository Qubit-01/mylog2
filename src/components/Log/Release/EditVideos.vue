<script setup lang="ts">
import dayjs from 'dayjs'
import type { UploadFiles } from 'element-plus'
import { fileType, type LogFileItem } from '@/stores/log'
import type { LogFile } from '../types'

// 文件名列表
const videos = defineModel<string[]>({ required: true })
// 外部传入的files，要朝里面放入cos文件对象。filesModel和files要双向绑定
// files变化要向model中注入cos文件
// model变化（由其他组件注入）要向向files里注入fileRaw
const filesModel = defineModel<{ [key in LogFileItem]: LogFile[] }>('files')

// File对象列表
const files = shallowRef<LogFile[]>([])

// 原有文件：编辑模块要传入一些图片进来
const videosOld = ref([...videos.value])
const { edit } = defineProps<{ edit?: boolean }>()

const index = ref(0) // 计数，用于命名
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

defineExpose({ files })

// 更新imgs文件名列表
watch([videosOld, () => files.value.length], () => {
  videos.value = [...videosOld.value, ...files.value.map(i => i.key!)]
})

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: LogFile, files: UploadFiles) => {
  const raw = file.raw!

  // 判断是否是视频,判断大小
  if (fileType.videos.indexOf(raw.type) < 0 || raw.size > fileType.videoSize) {
    files.pop()
    ElMessage.error('视频不符合要求')
    return
  }

  // 文件名
  file.key = `${dayjs().format('YYMMDD_HHmm')}-${index.value++}-${file.name}`
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
        v-model:file-list="files"
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
