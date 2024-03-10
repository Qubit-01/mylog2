<!-- 
  主页的置顶模块
 -->
<script setup lang="ts">
import { BucketCDN } from '@/stores/constant'
</script>

<template>
  <div class="top-log" v-m>
    <ElCarousel height="270px" class="carousel">
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/1675152910243-0.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/1666594529103-1.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/1666594529103-6.jpg'" />
      </ElCarouselItem>
      <ElCarouselItem>
        <img :src="BucketCDN + 'web-files/1674922554694-0.jpg'" />
      </ElCarouselItem>
      <div class="title">✨多元记2.0 全新亮相 ~</div>
    </ElCarousel>
    <div class="text">
      <div>
        <div>
          本站正式进入2.0，使用 Vue 3.3 + Vite + Element Plus + TypeScript +
          Pinia
          等技术栈，全新的设计，全新的体验，全新的功能，全新的内容，全新的未来。
        </div>
        <div>
          原名川农资讯网，现更名为多元记Mylog，旨在记录多元的生活，多元的技术，多元的知识，多元的感悟，多元的未来。
        </div>
        <div>
          朋友们帮我点个免费的Star吧，感谢：<a
            href="https://gitee.com/bit-01/mylog2"
            target="_black"
            >gitee.com/bit-01/mylog2</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.top-log {
  overflow: hidden;
  border-radius: var(--border-radius);

  .carousel {
    position: relative;

    .title {
      position: absolute;
      left: 24px;
      bottom: 24px;

      border-radius: var(--border-radius);
      padding: 12px;
      background-color: var(--m-background-color);
      backdrop-filter: blur(16px);

      font-size: 1.5em;
      font-weight: bold;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .text {
    padding: var(--padding);
  }
}
</style>
