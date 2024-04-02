<script setup lang="ts">
import { BucketCDN } from '@/stores/constant'
import useUserStore, { logout } from '@/stores/user'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue'

const User = useUserStore()

const router = useRouter()
const route = useRoute()

// 展开和收起
const isExpand = ref(false)

const tab = computed<string>({
  get: () => route.name as string,
  set: v => router.push({ name: v }),
})
</script>

<template>
  <div class="logger-page">
    <div class="logger-model" v-m>
      <div class="carousel">
        <img :src="BucketCDN + 'web-files/carousel-0.jpg'" />
        <div class="logout" @click="logout()">退出登录</div>
      </div>
      <div class="logger-info">
        <div class="img">
          <img :src="User.img" />
        </div>
        <div class="text">
          <div class="name">
            {{ User.name }}
            <span class="info">
              <span>{{ User.id }}</span>
              <span>{{ User.info.sex }}</span>
              <span>{{ User.info.birth }}</span>
            </span>
          </div>
          <div class="info">
            <div>{{ User.info.text }}</div>
          </div>
          <div v-if="isExpand" class="more">
            <div>info: {{ User.info }}</div>
            <div>setting.mylog: {{ User.setting.mylog }}</div>
            <div>setting.page: {{ User.setting.page }}</div>
            <div>setting: {{ Object.keys(User.setting) }}</div>
          </div>
        </div>
        <ElButton
          class="down-bold"
          @click="isExpand = !isExpand"
          :icon="isExpand ? ArrowUpBold : ArrowDownBold"
          text
          circle
        />
      </div>
    </div>

    <ElRadioGroup v-model="tab" size="large">
      <!-- size="large" -->
      <ElRadioButton label="多元记" value="logger" />
      <ElRadioButton label="设置" value="setting" />
    </ElRadioGroup>

    <RouterView />
  </div>
</template>

<style scoped lang="less">
.logger-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  .logger-model {
    overflow: hidden;
    border-radius: var(--border-radius);

    // 背景图片
    .carousel {
      height: 270px;
      position: relative;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
      .logout {
        position: absolute;
        top: 12px;
        right: 12px;

        border-radius: var(--border-radius);
        padding: 8px 12px;
        background-color: var(--m-background-color);
        backdrop-filter: blur(16px);

        cursor: pointer;
      }
    }

    // 头像信息
    .logger-info {
      position: relative;
      padding: 16px 24px 24px 24px;

      // 用户信息
      .text {
        display: flex;
        flex-direction: column;
        gap: var(--gap);

        .name {
          // display: flex;
          // gap: var(--gap);
          font-size: 2rem;
          font-weight: bold;
          .info {
            display: inline-flex;
            gap: 0.5rem;
            font-size: 1rem;
            color: var(--color-2);
          }
        }
      }

      .down-bold {
        position: absolute;
        right: 16px;
        bottom: 16px;
      }

      // 头像
      .img {
        height: 150px;
        width: 150px;
        overflow: hidden;
        border: 2px solid #fff5;
        border-radius: 50%;

        position: absolute;
        top: -100px;
        right: 50px;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
