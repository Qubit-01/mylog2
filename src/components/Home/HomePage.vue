<script setup lang="ts">
import useLogStore from '@/stores/log';

const logs = useLogStore()
logs.getLogsHome()
</script>

<template>
  <div class="home">
    
    <HomeTopLog/>
    <template v-if="!logs.loading">
      <Log v-for="i in logs.homeList" :log="i" />
    </template>
    <div v-else v-m>
      加载中...
    </div>

  </div>
</template>

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>