<!-- 
  这个页面主要用到 vis-network 库
  GitHub：https://github.com/visjs/vis-network/
  英文文档：https://visjs.github.io/vis-network/docs/network/
  中文文档：https://ame.cool/pages/a7d858/
 -->
<script setup lang="ts">
import { FullScreen, Refresh, Plus, Minus } from '@element-plus/icons-vue'
import useUserStore from '@/stores/user'
import { useVisNetwork } from '@/utils/vis-network'
import { ElButton } from 'element-plus'
import { useRelationStore } from '@/stores/relation'

const User = useUserStore()
const Relation = useRelationStore()

const networkDom = ref<HTMLDivElement>()

const VN = reactive(
  useVisNetwork(networkDom, {
    nodes: Relation.getNodes([
      { id: '0', label: User.name, color: '#daa', font: { size: 30 } },
    ]),
    edges: Relation.getEdges(),
  })
)

// 缩放按钮
const setScale = (num: number) => {
  if (num == 0) VN.network?.fit()
  if (num < 0 && VN.network!.getScale() < 0.12) return
  VN.network?.moveTo({ scale: VN.network?.getScale() + num })
}
</script>

<template>
  <div class="relation-page" v-m>
    <div class="buttons">
      <!-- <ElButton type="primary" :icon="FullScreen" @click="MaxNetwork()" /> -->
      <ElButton :icon="Refresh" @click="setScale(0)" />
      <ElButton :icon="Plus" @click="setScale(0.1)" />
      <ElButton :icon="Minus" @click="setScale(-0.1)" />
    </div>
    <div class="network" ref="networkDom"></div>

    <!-- 查看人员表单 -->
    <!-- <PeopleComp
        :selectedPeople="selectedPeople"
        :groups="groups"
        :handleRaws="handleRaws"
        :raws="raws"
      /> -->
  </div>
</template>

<style scoped lang="less">
.relation-page {
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
