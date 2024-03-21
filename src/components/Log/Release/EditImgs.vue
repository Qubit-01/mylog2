<!-- 
  图片上传组件 files必传
  会向files.imgs里面注入COS.UploadFileItemParams[]值

  添加图片的逻辑：如果添加的文件是不是图片文件
  1. 是定义了类型的文件，就放进相应files项中。
  2. 其他文件，放进files.files中


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
import type { UploadFiles } from 'element-plus'
import type { LogFile, LogImgFile, LogItem } from '../types'
import type { Log } from '@/types'
import { fileType, logFileItem, type LogFileItem } from '@/stores/log'
import { getExifByFile, compressImg, type ExifImgFile } from '@/utils/img'
import AMap, { l2v } from '@/utils/map'
import { toFileUrl } from '@/utils/cos'

// 文件名: 首次传入的数据会被imgsOld记录，然后立即被watch修改
const imgs = defineModel<string[]>({ required: true })
// 外部传入的files，要朝里面放入cos文件对象。
const filesModel = defineModel<
  {
    [key in LogFileItem]: LogFile[]
  } & {
    imgs: LogImgFile[]
  }
>('files', {
  required: true,
})

// 原有文件：编辑模块要传入一些图片进来
const imgsOld = ref([...imgs.value])
const { add, edit } = defineProps<{
  add: <T extends LogItem>(item: T, data?: Log[T]) => void
  edit?: boolean
}>()

let index = 1 // 给图片计数，用于命名
const count = ref(0) // 用于压缩时控制按钮
// watchEffect(() => count ? props.setIsLoad(true) : props.setIsLoad(false)) // 要控制外层的加载状态

// 更新imgs文件名列表
watch([imgsOld, () => filesModel.value.imgs.length], () => {
  imgs.value = [...imgsOld.value, ...filesModel.value.imgs.map(i => i.key!)]
})

watch(
  () => filesModel.value.imgs.length,
  () => {
    filesModel.value.imgs.forEach((file:LogImgFile) => {
      if (file.)
    })
  }
)

// :on-change 状态变化，添加文件、上传成功、失败
const onChange = async (file: LogImgFile, files: UploadFiles) => {
  const raw = file.raw!

  // Todo: 判断大小还没做

  // 文件名，现在是任何文件都接收，所以都要加key
  file.key = `${dayjs().format('YYMMDD-HHmmss')}-${index++}-${file.name}`

  for (const type of logFileItem) {
    console.log('🐤', type, fileType[type].indexOf(raw.type))

    if (fileType[type].indexOf(raw.type) > -1) {
      // 如果匹配到了其他类型，弹出后加进对应的filesModel
      if (type !== 'imgs') filesModel.value[type].push(files.pop()!)
      break // 匹配到了就要退出
    }
  }
}

const delImgOld = (img: string) => {
  imgsOld.value = imgsOld.value.filter(i => i !== img)
}

onUnmounted(() => {
  if (!edit) imgs.value = []
})

// 处理图片函数
const handleImg = async (file: LogImgFile) => {
  const raw = file.raw!
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
  for (const img of filesModel.value.imgs) {
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
    <div class="all-imgs">
      <div class="viewer-imgs">
        <!-- 模仿element upload组件的卡片 -->
        <ul class="el-upload-list el-upload-list--picture-card">
          <li
            v-for="img in imgsOld"
            :key="img"
            class="el-upload-list__item is-ready"
          >
            <img :src="toFileUrl(img, 'compress-imgs/')" />
            <span class="el-upload-list__item-actions">
              <ElIcon size="20" color="#fff" @click="delImgOld(img)">
                <Delete />
              </ElIcon>
            </span>
          </li>
        </ul>
      </div>

      <!-- 真正上传的 -->
      <ElUpload
        v-model:file-list="filesModel.imgs"
        class="upload-imgs"
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
      <ElButton
        :disabled="filesModel.imgs.length === 0"
        @click="useExif"
        size="small"
      >
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

  display: flex;
  flex-direction: column;
  gap: var(--block-gap);

  .all-imgs {
    max-width: 100%;
    display: flex;
    gap: var(--block-gap);
    overflow: auto;

    .viewer-imgs,
    .upload-imgs {
      :deep(ul.el-upload-list) {
        flex-wrap: nowrap;
        gap: var(--block-gap);

        > * {
          width: var(--block-width);
          height: var(--block-height);
          margin: 0;

          img {
            object-fit: cover;
            width: 100%;
            height: 100%;
          }

          &:empty {
            display: none;
          }
        }
      }
    }

    // 待上传的图片
    .upload-imgs {
      justify-content: flex-start;

      :deep(ul.el-upload-list) {
        li.el-upload-list__item {
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
          .el-upload-dragger {
            border: none;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
