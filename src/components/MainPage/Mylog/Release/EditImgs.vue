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
import type { Log } from '@/types'
import type { LogImgFile } from './types'
import type { UploadFiles, UploadUserFile } from 'element-plus'
import { getExifByFile, compressImg, type ExifImgFile } from '@/utils/img'

// 文件名
const imgs = defineModel<string[]>({ required: true })
// File对象列表
const files = defineModel<LogImgFile[]>('files', { required: true })
// File对象列表
const logEdit = defineModel<Log>('logEdit', { required: true })

const types = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg']
const SIZE = 10 * 1024 * 1024 // 图片大小限制，字节
const index = ref(0) // 给图片计数，用于命名
const count = ref(0) // 用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表
watchEffect(() => {
  imgs.value = files.value.map((i) => i.key!)
})

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

// 自动用Exif信息补全
// const useExif = () => {
//   let exif = null,
//     haveItems = [false, false]
//   for (const img of files.value) {
//     exif = img.raw!.exifdata
//     if (JSON.stringify(exif) == '{}') continue
//     if (!haveItems[0] && exif.DateTime) {
//       // "2023:03:08 16:07:01" 转为 "2023-03-23 16:07:01"
//       logEdit.value.logtime = exif.DateTime.replace(':', '-').replace(':', '-')
//       haveItems[0] = true
//     }
//     if (!haveItems[1] && exif.GPSLongitude && exif.GPSLatitude) {
//       let [lng, lat] = [exif.GPSLongitude, exif.GPSLatitude]
//       lng = lng[0] + lng[1] / 60 + lng[2] / 3600
//       lat = lat[0] + lat[1] / 60 + lat[2] / 3600
//       let gpsPoint = new BMap.Point(lng, lat)
//       // 图片里面是GPS坐标，要转为百度地图用的bd09ll
//       new BMap.Convertor().translate([gpsPoint], 1, 5, (p) => {
//         if (!props.editNote.noteLocation) props.editNote.noteLocation = []
//         props.editNote.noteLocation[0] = [p.points[0].lng, p.points[0].lat]
//       })
//       haveItems[1] = true
//     }

//     let f = haveItems.reduce(
//       (total, currentValue) => total && currentValue,
//       true
//     )
//     if (f) return
//     else continue
//   }

//   let f = haveItems.reduce(
//     (total, currentValue) => total || currentValue,
//     false
//   )
//   if (!f) ElMessage.error('没有提取到信息')
// }

// console.log(BMapGL)
</script>

<template>
  <div class="edit-imgs">
    <!-- 
      multiple 支持多选文件
      drag 启用拖拽上传	(有样式bug)
      accept 接受上传的文件类型
      auto-upload 禁止自动上传
      亲测on-change可能因为禁用了自动上传，只有这个起作用
      :on-remove="handleRemove"
     -->
    <ElUpload
      class="edit-imgs-upload"
      list-type="picture-card"
      multiple
      drag
      v-model:file-list="files"
      :on-change="onChange"
      :auto-upload="false"
    >
      <ElIcon><Plus /></ElIcon>
    </ElUpload>
    <!-- <ElButton
      v-if="files.length"
      @click="useExif"
      size="small"
      style="margin-right: 10px"
    >
      提取时间位置
    </ElButton> -->
    <!--
    <el-switch v-if="haveCover == ''" v-model="editNote.isCoverImgs" size="small" inline-prompt active-text="覆盖"
      inactive-text="添加" />
    <el-switch v-if="editNote.noteImgs" v-model="editNote.isRawImgs" size="small" inline-prompt active-text="原图"
      inactive-text="高清" />
    <span style="font-size: 12px;color:var(--mini-text-color)">图片小于{{ SIZE }}MB</span>
  --></div>
</template>

<style scoped lang="less">
.edit-imgs {
  --block-height: 100px;
  --block-width: 100px;
  --block-gap: 2px;

  .edit-imgs-upload {
    max-width: 100%;
    overflow: auto;
    justify-content: flex-start;

    :deep(ul.el-upload-list) {
      flex-wrap: nowrap;
      gap: var(--block-gap);

      > * {
        width: var(--block-width);
        height: var(--block-height);
        margin: 0;
      }

      li.el-upload-list__item {
        order: 2;

        // 图片
        .el-upload-list__item-thumbnail {
          object-fit: cover;
        }

        // 隐藏预览按钮
        .el-upload-list__item-preview {
          display: none;
        }

        // 居中删除按钮
        .el-upload-list__item-delete {
          margin: 0;
        }
      }

      // 添加按钮
      div.el-upload.el-upload--picture-card {
        order: 1;
        border: 0;

        .el-upload-dragger {
          // width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
