<script setup lang="ts">
import { useVisNetwork } from '@/utils/vis-network'

// const networkDom = ref<HTMLDivElement>()
</script>

<template>
  <div class="test-page" v-m></div>
</template>

<style scoped lang="less">
.test-page {
  border-radius: var(--border-radius);
  padding: var(--padding);

  height: calc(100vh - var(--header-top) - var(--gap));

  display: flex;
  flex-direction: column;

  .network {
    height: 0;
    flex: 1;
  }
}
</style>
