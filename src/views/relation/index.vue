<!-- 
  这个页面主要用到 vis-network 库
  GitHub：https://github.com/visjs/vis-network/
  英文文档：https://visjs.github.io/vis-network/docs/network/
  中文文档：https://ame.cool/pages/a7d858/
 -->
<script setup lang="ts">
import vis from "vis-network/dist/vis-network.min.js"

// let nodes = [{ id: 0, label: User.name, color: '#daa', font: { size: 30 } }], edges = []
// const groups = reactive(['亲戚', '其他人'])
const groups = reactive(['亲戚'])

const options = {
  autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
  interaction: {
    zoomView: false, //是否能缩放画布
  },
  nodes: {
    shape: 'box', //设置节点node样式为矩形
    fixed: false, //节点node固定可移动
    font: { size: 20, }, //显示字体大小
  },
  edges: {
    arrows: { to: true },
  },
  layout: {
    randomSeed: 5,  // 布局种子，使其每次布局都一样
  },
};

onMounted(() => {

})
console.log('🐤', vis)
</script>

<template>
  <div class="relation-page">
    <div class="relation-network" v-m>
      网络
    </div>
  </div>
</template>

<style scoped lang="less">
.relation-page {

  .relation-network {
    padding: var(--padding);
    border-radius: var(--border-radius);
  }
}
</style>
