<script setup lang="ts">
import { BucketCDN } from '@/stores/constant'
import useGlobalStore from '@/stores/global'
const Global = useGlobalStore()
const User = Global.user
const router = useRouter()
</script>

<template>
  <div class="header">
    <header v-m>
      <div class="center">
        <div class="left">
          <div class="logo" @click="router.push('/')">
            <img :src="BucketCDN + 'web-files/favicon.svg'" />
            多元记
          </div>
        </div>
        <nav>
          <!-- 我的主页（别人看见的） -->
          <RouterLink to="/logger">主页</RouterLink>
          <!-- 我的记录（自己看见的） -->
          <RouterLink to="/mylog">记录</RouterLink>
          <RouterLink to="/album">相册</RouterLink>
          <RouterLink to="/map">地图</RouterLink>
          <RouterLink to="/relation">人脉</RouterLink>
        </nav>
        <div class="right">
          <div v-if="Global.isLogined" class="user">{{ User.name }}</div>
          <RouterLink v-else to="/login">去登录</RouterLink>
          <ThemeSwitch />
        </div>
      </div>
    </header>
    <div class="placeholder"></div>
  </div>
</template>

<style scoped lang="less">
.header {
  header {
    position: fixed;
    z-index: 50;
    width: 100%;
    display: flex;
    justify-content: center;
    line-height: var(--header-height);
    // 覆盖 -m 的一些样式
    border-top: 0;
    border-left: 0;
    border-right: 0;

    > .center {
      width: var(--center-width);
      transition: width 0.5s;

      display: flex;
      column-gap: var(--gap);
      justify-content: space-between;
      align-items: center;

      > nav {
        flex: 1;
        display: flex;
        justify-content: center;
        // justify-content: flex-start;
        font-size: 1.1rem;
        height: var(--header-height);

        > a {
          text-decoration: none;
          color: inherit;
          padding-left: 20px;
          padding-right: 20px;

          &:hover {
            background: #ccc5;
          }
        }
      }

      > .left {
        .logo {
          position: relative;
          font-size: 22px;
          width: var(--lan-width);
          height: var(--header-height);
          padding-left: 20px;
          padding-right: 20px;

          display: flex;
          justify-content: center;

          &:hover {
            background: #aaa5;
          }

          img {
            position: absolute;
            height: 34px;
            left: 80px;
            top: 25px;
            opacity: 0.7;
          }
        }
      }

      > .right {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: flex-end;

        .theme-switch {
          --el-switch-on-color: #2c2c2c;
          --el-switch-off-color: #f2f2f255;
          --color: #333;
        }
      }

      @media (max-width: 700px) {
        flex-wrap: wrap;
        > .left {
          width: 45%;
        }
        > .right {
          width: 45%;
        }

        > nav {
          order: 2;
        }
      }
    }
  }

  // 占位
  .placeholder {
    height: var(--header-top);
  }
}
</style>
