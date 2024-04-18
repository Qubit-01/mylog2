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
import type { Relation } from '@/types'

const User = useUserStore()
const Relation = useRelationStore()

const networkDom = ref<HTMLDivElement>()
// 当前显示的log
const relations = reactive<{
  list: Relation[]
  curPage: number
  node: string
}>({
  list: [],
  curPage: 1,
  node: '',
})

const VN = reactive(
  useVisNetwork(networkDom, {
    nodes: Relation.getNodes([
      { id: '0', label: User.name, color: '#daa', font: { size: 30 } },
    ]),
    edges: Relation.getEdges(),
  })
)

VN.init.then(network => {
  // 目前只支持单选
  network.on('click', e => {
    // console.log(e)
    const n = e.nodes[0]
    console.log(n)

    relations.node = n

    // 组节点
    // if (Number(n)) {
    //   if (n==='0')
    // }
    // if (!Number(n)) relations.group = n
    // else if (n==='0')
    // else relations.group = ''

    relations.list = Relation.listAll.filter(i => e.nodes.includes(i.id))
  })
})

// 缩放按钮
const setScale = (num: number) => {
  if (num == 0) VN.network?.fit()
  if (num < 0 && VN.network!.getScale() < 0.12) return
  VN.network?.moveTo({ scale: VN.network?.getScale() + num })
}
</script>

<template>
  <div class="relation-page" v-m>
    <div class="network" ref="networkDom"></div>

    <div class="buttons">
      <!-- <ElButton type="primary" :icon="FullScreen" @click="MaxNetwork()" /> -->
      <ElButton :icon="Refresh" @click="setScale(0)" />
      <ElButton :icon="Plus" @click="setScale(0.1)" />
      <ElButton :icon="Minus" @click="setScale(-0.1)" />
    </div>

    <div class="bottom">
      <div v-if="relations.node && !Number(relations.node)">
        <GroupComp :group="relations.node" />
      </div>

      <!-- {{ relations }} -->
      <div v-if="relations.list.length">
        <RelationComp
          :relation="relations.list[relations.curPage - 1]"
          :key="relations.list[relations.curPage - 1].id"
        >
          <ElPagination
            small
            background
            layout="prev, pager, next"
            :page-size="1"
            v-model:current-page="relations.curPage"
            :total="relations.list.length"
            hide-on-single-page
            style="justify-content: center"
          />
        </RelationComp>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.relation-page {
  position: relative;
  border-radius: var(--border-radius);
  padding: var(--padding);
  height: calc(100vh - var(--header-top) - var(--gap));

  display: flex;
  flex-direction: column;

  .network {
    height: 0;
    flex: 1;
  }

  .buttons {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
  }

  .bottom {
    position: absolute;
    bottom: var(--padding);
    left: var(--padding);
    right: var(--padding);
  }
}
</style>
