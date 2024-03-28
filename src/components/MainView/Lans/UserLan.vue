<script setup lang="ts">
import useUserStore, { logout } from '@/stores/user'
const User = useUserStore()
console.log(User.img)
</script>
<!-- 可以加点数量统计 -->
<template>
  <div class="user-lan" v-m>
    <template v-if="User.isLogined">
      <div class="img">
        <img :src="User.img" alt="用户头像" />
      </div>
      <div class="title">
        {{ User.name }}
      </div>
      <div class="items">
        <div>发个Log</div>
        <div @click="logout()">退出</div>
      </div>
    </template>
    <template v-else>
      <div class="items">
        <router-link to="/login">登录</router-link>
        <router-link to="/register">注册</router-link>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
.user-lan {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-radius: var(--border-radius);

  .img {
    margin-top: 8px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 1.5rem;
  }

  .items {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>
