<script setup lang="ts">
import useGlobalStore from '@/stores/global';
const Global = useGlobalStore();
const User = Global.user;
</script>
<!-- 可以加点数量统计 -->
<template>
  <div class="user-lan" v-m>
    <template v-if="Global.isLogined">
      <div class="img">
        <img :src="User.img" alt="用户头像">
      </div>
      <div class="name">
        {{ User.name }}
      </div>
      <div>我的主页</div>
      <div>发个 Log</div>
    </template>
    <template v-else>
      <div>
        {{ User.name }}
      </div>
      <div>
        <router-link to="/login">登录</router-link>
      </div>
      <div>
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

  .name {
    font-size: 1.5rem;
  }
}
</style>