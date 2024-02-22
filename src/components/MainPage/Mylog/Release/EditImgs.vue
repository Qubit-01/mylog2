<!-- 
  图片压缩、上传，图片EXIF信息解析
  ElUpload组件文档：https://element-plus.org/zh-CN/component/upload.html#%E5%B1%9E%E6%80%A7
  原图、压缩图、95压缩图（几乎无损压缩，但是可以大量节省空间）

  * 文件结构是
  * LogImgFile
  *   - key 文件名，上传时间-序号-文件名
  *   - raw 原始文件
  *   - compressImg 压缩文件
  *   - compressImg95 95压缩文件
  * 其中每个文件都有exifdata和iptcdata
-->
<script setup lang="ts">
import dayjs from 'dayjs'
import type {
  UploadFile,
  UploadFiles,
  UploadUserFile,
  UploadRawFile,
} from 'element-plus'
import { getExifByFile, compressImg, type ExifImgFile } from '@/utils/img'

const imgs = defineModel<string[]>({ required: true })
const files = defineModel<UploadUserFile[]>('files', { required: true })
const types = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg']
const SIZE = 10 * 1024 * 1024 // 图片大小限制，字节
const index = ref(0) // 给图片计数，用于命名
const count = ref(0) // 给图片计数，用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

interface LogImgFile extends UploadFile {
  key?: string // 文件名，上传时间-序号-文件名
  compressImg?: ExifImgFile // 压缩文件
  compressImg95?: ExifImgFile // 95压缩文件
}

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: LogImgFile, files: UploadFiles) => {
  const raw = file.raw! as ExifImgFile

  // 判断是否是图片,判断大小
  if (types.indexOf(raw.type) < 0 || raw.size > SIZE) {
    files.pop()
    ElMessage.error('图片不符合要求')
    return
  }

  // 文件名，并给noteImgs 赋值文件名
  file.key = `${dayjs().format('YYMMDD_HHmm')}-${index.value++}-${file.name}`

  // exifdata 直接被写入了file.raw中
  await getExifByFile(raw)

  // raw 是原始文件，compressImg是压缩文件，compressImg95是轻微压缩
  count.value++
  compressImg(raw).then((res: any) => {
    res.exifdata = raw.exifdata
    res.iptcdata = raw.iptcdata
    file.compressImg = res
    count.value--
  })
  count.value++
  compressImg(raw, 0.98).then((res: any) => {
    res.exifdata = raw.exifdata
    res.iptcdata = raw.iptcdata
    file.compressImg95 = res
    count.value--
  })
}
</script>

<template>
  <div class="edit-imgs">
    {{ files }}
    <!-- 
      multiple 支持多选文件
      drag 启用拖拽上传	(有样式bug)
      accept 接受上传的文件类型
      auto-upload 禁止自动上传
      亲测on-change可能因为禁用了自动上传，只有这个起作用
     -->
    <ElUpload
      class="el-upload"
      list-type="picture-card"
      multiple
      drag
      :file-list="files"
      :on-change="onChange"
      :auto-upload="false"
    />
    <!-- <ElIcon>
        <Plus />
      </ElIcon> -->
    <!-- </ElUpload> -->

    <!-- <el-upload class="el-upload" v-model:file-list="editNote.fImgs" list-type="picture-card" multiple :auto-upload="false"
      :on-change="handleChange" :on-remove="handleRemove">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload> -->
    <!-- <el-button v-if="editNote.noteImgs.length" @click="useExif" size="small"
      style="margin-right: 10px;">提取时间位置</el-button>
    <el-switch v-if="haveCover == ''" v-model="editNote.isCoverImgs" size="small" inline-prompt active-text="覆盖"
      inactive-text="添加" />
    <el-switch v-if="editNote.noteImgs" v-model="editNote.isRawImgs" size="small" inline-prompt active-text="原图"
      inactive-text="高清" />
    <span style="font-size: 12px;color:var(--mini-text-color)">图片小于{{ SIZE }}MB</span> -->
  </div>
</template>

<style scoped lang="less">
.edit-imgs {
  .el-upload {
  }
}
</style>
