<script setup lang="ts">
import { useVisNetwork } from '@/utils/vis-network'

const networkDom = ref<HTMLDivElement>()

const VN = reactive(
  useVisNetwork(networkDom, {
    nodes: [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
    ],
  })
)

const addNode = () => {
  VN.nodes.add({
    label: 'wc',
  })
}
</script>

<template>
  <div class="test-page" v-m>
    <div>
      <ElButton @click="addNode">添加</ElButton>
    </div>
    <div class="network" ref="networkDom"></div>
  </div>
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
