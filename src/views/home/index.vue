<script setup lang="ts">
import useLogStore from '@/stores/log'

const logStore = useLogStore()
const home = logStore.home
home.addLogs!()
</script>

<template>
  <div class="home-page" v-infinite-scroll="home.addLogs!" :infinite-scroll-disabled="home.loading">
    <HomeTopLog />

    <Log v-for="log in home.list" :log="log" />

    <LogLoading v-if="home.loading" />

    <!-- <div v-if="home.loading" class="loading" v-m v-loading="home.loading" element-loading-text="正在加载更多Log..."
      element-loading-background="transparent">
    </div> -->

  </div>
</template>

<style scoped lang="less">
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>