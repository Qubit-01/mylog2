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
import type { LogImgFile, LogItem } from '../types'
import type { UploadFiles } from 'element-plus'
import { getExifByFile, compressImg, type ExifImgFile } from '@/utils/img'
import AMap, { l2v } from '@/utils/map'
import { toFileUrl } from '@/utils/cos'

// 文件名: 首次传入的数据会被imgsOld记录，然后立即被watch修改
const imgs = defineModel<string[]>({ required: true })
// 原有文件：编辑模块要传入一些图片进来
const imgsOld = ref([...imgs.value])
const { add, edit } = defineProps<{
  // 添加项目
  add: <T extends LogItem>(item: T, data?: Log[T]) => void
  edit?: boolean
}>()

// File对象列表
const files = shallowRef<LogImgFile[]>([])

const types = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg']
const SIZE = 10 * 1024 * 1024 // 图片大小限制，字节
const index = ref(0) // 给图片计数，用于命名
const count = ref(0) // 用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

defineExpose({ files })

// 更新imgs文件名列表
watch([imgsOld, () => files.value.length], () => {
  imgs.value = [...imgsOld.value, ...files.value.map(i => i.key!)]
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

  // 文件名
  file.key = `${dayjs().format('YYMMDD_HHmm')}-${index.value++}-${file.name}`

  // exifdata 直接被写入了file.raw中
  await getExifByFile(raw)

  // raw原始文件，compressImg压缩文件，compressImg95轻微压缩
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
const useExif = () => {
  let exif = null
  const flag = {
    logtime: false,
    location: false,
  }
  for (const img of files.value) {
    exif = img.raw!.exifdata
    if (!Object.keys(exif).length) continue

    if (!flag.logtime) {
      let dateTime =
        exif.DateTimeOriginal || // 照片在被拍下来的日期/时间，通常和DateTime一样
        exif.DateTime || // 图像最后一次被修改时的日期/时间 "YYYY:MM:DD HH:MM:SS"
        exif.DateTimeDigitized // 照片被数字化时的日期/时间
      if (dateTime) {
        // 'YYYY:MM:DD HH:MM:SS' 转为 'YYYY-MM-DD HH:mm:ss'
        dateTime = dateTime.replace(':', '-').replace(':', '-')
        add('logtime', dayjs(dateTime))
        flag.logtime = true
      }
    }

    if (!flag.location) {
      let [lng, lat] = [exif.GPSLongitude, exif.GPSLatitude]
      if (lng && lat) {
        lng = lng[0] + lng[1] / 60 + lng[2] / 3600
        lat = lat[0] + lat[1] / 60 + lat[2] / 3600
        // 图片里面是GPS坐标，要转
        AMap.convertFrom([lng, lat], 'gps', (status: string, result: any) => {
          // status：complete 查询成功，no_data 无结果，error 错误
          // 查询成功时，result.locations 即为转换后的高德坐标系
          if (status === 'complete' && result.info === 'ok') {
            add('location', [l2v(result.locations[0]), ''])
            flag.location = true
          }
        })
      }
    }

    if (flag.logtime && flag.location) return
  }

  if (!flag.logtime && !flag.location) ElMessage.error('没有提取到信息')
}

const delImgOld = (img: string) => {
  imgsOld.value = imgsOld.value.filter(i => i !== img)
}

onUnmounted(() => {
  if (!edit) imgs.value = []
})
</script>

<template>
  <div class="edit-imgs">
    <!-- <div>imgs: {{ imgs }}</div>
    <div>imgsOld: {{ imgsOld }}</div>
    <div>files: {{ files }}</div> -->
    <!-- 
      multiple 支持多选文件
      drag 启用拖拽上传	(有样式bug)
      accept 接受上传的文件类型
      auto-upload 禁止自动上传
      亲测on-change可能因为禁用了自动上传，只有这个起作用
      :on-remove="handleRemove"
     -->
    <div class="all-imgs">
      <div class="viewer-imgs">
        <div v-for="img in imgsOld" :key="img">
          <img :src="toFileUrl(img, 'compress-imgs/')" />
          <span class="actions">
            <ElIcon size="20" color="#fff" @click="delImgOld(img)">
              <Delete />
            </ElIcon>
          </span>
        </div>
      </div>

      <ElUpload
        v-model:file-list="files"
        class="edit-imgs-upload"
        list-type="picture-card"
        multiple
        drag
        :on-change="onChange"
        :auto-upload="false"
      >
        <ElIcon><Plus /></ElIcon>
      </ElUpload>
    </div>
    <div>
      <ElButton :disabled="files.length === 0" @click="useExif" size="small">
        提取时间位置
      </ElButton>
    </div>

    <!--
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

  .all-imgs {
    display: flex;
    gap: var(--block-gap);

    .viewer-imgs {
      white-space: nowrap;
      overflow-y: hidden;
      width: fit-content;
      max-width: 100%;

      display: flex;
      gap: var(--block-gap);

      > div {
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        height: var(--block-height);
        width: var(--block-height);
        overflow: hidden;
        position: relative;

        img {
          flex-shrink: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .actions {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--el-overlay-color-lighter);

          display: inline-flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity var(--el-transition-duration);

          > .el-icon {
            cursor: pointer;
          }

          &:hover {
            opacity: 1;
          }
        }
      }
    }

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
}
</style>
