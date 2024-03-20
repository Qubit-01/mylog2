<!-- 
  如果是 用户log 就要有要有查看原图的功能
  但是爬虫数据不需要查看原图功能

  主要用到 viewerjs， 相关文档：
  https://blog.csdn.net/xingmeiok/article/details/127556464
 -->
<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { toFileUrl } from '@/utils/cos'
import type { Log } from '@/types'

// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!

/**
 * imgs是图片列表
 */
const props = defineProps<{ imgs: string[] }>()

// 传入的图片要处理，如果不是http开头，那么就加上OOS地址，否则直接用，而且要改为https
const imgs = ref<string[]>(toFileUrl(props.imgs, 'compress-imgs/', log.userid))

watchEffect(()=>{
  console.log('🐤i change', imgs.value)
})

const viewer = ref<Viewer>() // viewerjs对象
const viewerDom = ref<HTMLElement>() // 用于装载用ref属性获取的Dom
const rawBtuDom = ref<HTMLElement>() // 查看原图按钮的DOM

onMounted(() => {
  // 3句话，让viewer为我打工
  viewer.value = new Viewer(viewerDom.value!, {
    // button: false, //右上角关闭按钮
    // title: false, // 图片标题
    shown() {
      // 大图展示时，加入查看原图按钮
      ;(viewer.value as any).toolbar
        .querySelector('ul')
        .appendChild(rawBtuDom.value)
    },
  })
})

// 点击加载原图
const loadRaw = () => {
  const i = (viewer.value as any).index
  const newImg = toFileUrl(props.imgs[i], 'imgs/', log.userid)
  if (imgs.value[i] !== newImg) {
    imgs.value[i] = newImg
    nextTick(() => viewer.value!.update()) // .view(i)
  }
}

/**
 * 重试加载图片指令
 * 参数是一个数组，第一个是重试次数，第二个是重试间隔，默认是3次，间隔3秒
 * 用于阿里云刚刚才存储图片，这边就开始访问
 */
const vErrorRetry = {
  created(
    imgDom: HTMLImageElement,
    { value = [3, 3000] }: { value: [number, number] }
  ) {
    let errortime = 0
    imgDom.onerror = () => {
      if (errortime < value![0])
        setTimeout(() => (imgDom.src = imgDom.src), value![1])
      errortime++
    }
  },
}

defineExpose({ vErrorRetry })
</script>

<template>
  <div class="viewer-imgs" ref="viewerDom" @click.stop>
    <template v-for="img in imgs" :key="img">
      <!-- QQ图片要单独去除 referrer -->
      <img
        v-if="img.indexOf('photo.store.qq.com') === 15"
        referrerPolicy="no-referrer"
        :src="img"
        alt="qqimg"
      />
      <img v-else :src="img" :alt="img.split('/').at(-1)" v-error-retry />
    </template>
  </div>

  <!-- 要插入viewer中的查看原图按钮 -->
  <template v-show="false">
    <li ref="rawBtuDom" class="viewer-raw" @click="loadRaw">查看原图</li>
  </template>
</template>

<style scoped lang="less">
.viewer-imgs {
  white-space: nowrap;
  overflow-y: hidden;
  width: fit-content;
  max-width: 100%;

  display: flex;
  gap: var(--block-gap);

  img {
    flex-shrink: 0;
    object-fit: cover;
    height: var(--block-height);
    width: var(--block-height);
    border-radius: var(--block-border-radius);
  }
}

// 查看原图按钮
.viewer-raw {
  color: #fff;
  font-size: 15px;
  border-radius: 12px;
  width: 80px;
  line-height: 24px;
}
</style>

<style lang="less">
body {
  /* viewer的按钮设置: 由于viwer是直接生成新dom到根下，只能写在这里 */
  > .viewer-container > .viewer-footer {
    /* 工具栏 */
    .viewer-toolbar {
      // 放大
      .viewer-zoom-in,
      // 缩小
      .viewer-zoom-out,
      // 中间幻灯片播放
      .viewer-play,
      // 逆时针旋转
      .viewer-rotate-left,
      // 水平旋转
      .viewer-flip-horizontal,
      // 垂直旋转
      .viewer-flip-vertical {
        display: none;
      }
    }
  }
}
</style>
