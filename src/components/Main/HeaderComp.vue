<script setup lang="ts">
// import { Sunny, Moon } from '@element-plus/icons-vue'
const theme = ref<boolean>(true)
</script>

<template>
  <div class="header">
    <header class="-m">
      <div class="center">
        <div class="left">
          <div class="logo">
            <img src="https://bit-1310383539.cos.ap-chengdu.myqcloud.com/web-files/favicon.svg" />
            多元记
          </div>

        </div>
        <nav>
          <RouterLink to="/">主页</RouterLink>
          <RouterLink to="/mylog">记录</RouterLink>
          <RouterLink to="/login">注册</RouterLink>
        </nav>
        <div class="right">
          <!-- <div class="item hoverBottom user">
            <span class="t" v-if="User.name">{{ User.name }}</span>
            <span class="t" v-else @click="router.push('/login')">未登录</span>
            <div class="xlmenu" v-if="User.name">
              <div class="hoverBottom mypage" @click="router.push('/user')">我的主页</div>
              <div class="hoverBottom mypage" @click="logout">退出登录</div>
            </div>
          </div> -->
          <!-- <ElSwitch v-model="theme" inline-prompt
            style="--el-switch-on-color: var(--btn-color); --el-switch-off-color: var(--btn-color)" active-text="暗"
            inactive-text="亮" /> -->
          <!-- <ElSwitch v-model="theme" inline-prompt active-text="暗" inactive-text="亮" 
          :active-action-icon="Moon" :inactive-action-icon="Sunny"/> -->
        </div>
      </div>
    </header>
    <div class="placeholder"></div>
  </div>
</template>

<style scoped lang="less">
.header {
  // 顶栏的高度
  --height: 50px;
}

header {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  line-height: var(--height);
  // 覆盖 -m 的一些样式
  border-top: 0;
  border-left: 0;
  border-right: 0;

  >.center {
    width: var(--center-width);

    display: flex;
    justify-content: space-between;
    align-items: center;

    >nav {
      // border: 1px solid;
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      height: var(--height);

      // width: 200px;

      >a {
        text-decoration: none;
        color: inherit;
        padding-left: 20px;
        padding-right: 20px;

        &:hover {
          background: #ccc5;
        }
      }

    }

    >.left {
      .logo {
        position: relative;
        font-size: 22px;
        height: var(--height);
        padding-left: 20px;
        padding-right: 20px;

        &:hover {
          background: #aaa5;
        }

        img {
          position: absolute;
          height: 30px;
          left: 70px;
          top: 20px;
          opacity: 0.7;
        }
      }
    }

    >.right {}
  }
}

// 占位
.placeholder {
  height: calc(var(--height) + var(--gap));
}
</style>