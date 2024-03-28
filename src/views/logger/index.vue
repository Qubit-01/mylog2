<script setup lang="ts">
import useUserStore from '@/stores/user'

const User = useUserStore()
</script>

<template>
  <div class="logger-page" v-m>
    <div class="logger-info">
      <div class="img"><img :src="User.img" /></div>
      <div>{{ User.id }}</div>
      <div>{{ User.info }}</div>
      <div>{{ User.name }}</div>
      <div>{{ User.setting }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.logger-page {
  .logger-info {
    .img {
      height: 50px;
      width: 50px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
