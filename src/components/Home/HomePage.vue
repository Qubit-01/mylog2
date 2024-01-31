<script setup lang="ts">
import { useLogStore } from '@/stores/log';

const logs = useLogStore()
logs.getLogsHome()
</script>

<template>
  <div class="home">
    <div class="top-log" v-m>
      指定
    </div>
    <template v-if="!logs.loading">
      <Log v-for="i in logs.list" :log="i" />
    </template>
    <div v-else v-m>
      加载中...
    </div>

  </div>
</template>

<style scoped lang="less">
.home {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  .top-log {
    border-radius: var(--border-radius);
    padding: var(--padding);
  } 
}
</style>