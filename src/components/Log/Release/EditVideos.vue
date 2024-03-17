<script setup lang="ts">
import dayjs from 'dayjs'
import type { UploadFiles } from 'element-plus'
import type { LogFile } from '../types'

// 文件名列表
const videos = defineModel<string[]>({ required: true })
const { edit } = defineProps<{
  edit?: boolean
}>()
// File对象列表
const files = shallowRef<LogFile[]>([])

const types = ['video/mp4']
const SIZE = 500 * 1024 * 1024 // 大小限制，字节
const index = ref(0) // 计数，用于命名
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

defineExpose({ files })

// 更新imgs文件名列表
watchEffect(() => {
  videos.value = files.value.map(i => i.key!)
})

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: LogFile, files: UploadFiles) => {
  const raw = file.raw!

  // 判断是否是视频,判断大小
  if (types.indexOf(raw.type) < 0 || raw.size > SIZE) {
    files.pop()
    ElMessage.error('视频不符合要求')
    return
  }

  // 文件名
  file.key = `${dayjs().format('YYMMDD_HHmm')}-${index.value++}-${file.name}`
}

onUnmounted(() => {
  if (!edit) videos.value = []
})
</script>
<template>
  <div class="edit-videos">
    <ElUpload
      multiple
      v-model:file-list="files"
      :on-change="onChange"
      :auto-upload="false"
    >
      <ElButton type="primary">上传视频</ElButton>
    </ElUpload>
  </div>
</template>

<style scoped lang="less"></style>
