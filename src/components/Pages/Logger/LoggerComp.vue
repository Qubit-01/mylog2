<script setup lang="ts">
import useLogStore from '@/stores/log'

const logStore = useLogStore()
const logger = logStore.logger
logger.addLogs!()
</script>

<template>
  <div
    class="logger-comp"
    v-infinite-scroll="logger.addLogs!"
    :infinite-scroll-disabled="logger.loading"
  >
    <Log v-for="log in logger.list" :log="log" />

    <LogLoading v-if="logger.loading" />
  </div>
</template>

<style scoped lang="less">
.logger-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
