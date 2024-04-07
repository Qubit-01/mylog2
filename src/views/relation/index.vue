<!-- 
  这个页面主要用到 vis-network 库
  GitHub：https://github.com/visjs/vis-network/
  英文文档：https://visjs.github.io/vis-network/docs/network/
  中文文档：https://ame.cool/pages/a7d858/
 -->
<script setup lang="ts">
import vis from 'vis-network/dist/vis-network.min.js'
import { FullScreen, Refresh, Plus, Minus } from '@element-plus/icons-vue'
import useUserStore from '@/stores/user'
import { getRelations } from '@/api/relation'

const User = useUserStore()

let network: any
const networkDom = ref<HTMLDivElement>()
const nodes: any[] = []
const edges: any[] = []
const groups = reactive(['亲戚'])

const options = {
  autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
  interaction: {
    zoomView: false, //是否能缩放画布
  },
  nodes: {
    shape: 'box', //设置节点node样式为矩形
    fixed: false, //节点node固定可移动
    font: { size: 20 }, //显示字体大小
  },
  edges: {
    arrows: { to: true },
  },
  layout: {
    randomSeed: 5, // 布局种子，使其每次布局都一样
  },
}

const getData = getRelations({})

onMounted(() => {
  getData.then(raws => {
    console.log(raws)

    nodes.push({ id: '0', label: User.name, color: '#daa', font: { size: 30 } })

    for (const raw of raws) {
      console.log(1, raw.name)
      // 解析人员节点
      nodes.push({
        id: raw.id,
        label: raw.name,
        from: raw.from,
        // group: raw.rGroup,
        raw,
      })
      console.log(raw.name, raw.from, raw.id)
      edges.push({
        from: raw.from,
        to: raw.id,
        label: raw.info.label,
      })
      // 归纳组节点
      if (!Number(raw.from) && groups.indexOf(raw.from) == -1)
        groups.push(raw.from)
    }

    for (const v of groups) {
      console.log(v)
      nodes.push({
        id: v,
        label: v,
        from: 0,
        color: '#ddd',
        shape: 'ellipse',
        font: { size: 20 },
      })
      edges.push({ from: 0, to: v })
    }

    network = new vis.Network(networkDom.value, { nodes, edges }, options)
  })
})
// console.log('🐤', vis)

// 缩放按钮
const setScale = (num: number) => {
  if (num == 0) network.fit()
  if (num < 0 && network.getScale() < 0.12) return
  network.moveTo({ scale: network.getScale() + num })
}
</script>

<template>
  <div class="relation-page">
    <!-- 外层div 用于fixed占位 -->
    <!-- <div class="out-network model"> -->
    <div class="relation-network" v-m>
      <div class="network" ref="networkDom"></div>
      <div class="buttons">
        <ElButton type="primary" :icon="FullScreen" @click="MaxNetwork()" />
        <ElButton type="primary" :icon="Refresh" @click="setScale(0)" />
        <ElButton type="primary" :icon="Plus" @click="setScale(0.1)" />
        <ElButton type="primary" :icon="Minus" @click="setScale(-0.1)" />
      </div>
    </div>
    <!-- </div> -->

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
  .relation-network {
    padding: var(--padding);
    border-radius: var(--border-radius);

    .network {
      height: 60vh;
    }
  }
}
</style>
