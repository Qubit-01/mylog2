<!--
  垂直方向的中间部分，包含左右栏，和主要展示内容（是个路由组件）
-->
<script setup lang="ts">

</script>

<template>
  <div class="main">
    <div>左栏</div>
    <div>右栏</div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  border: 1px solid white;
}
</style>