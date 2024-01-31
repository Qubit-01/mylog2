<script setup lang="ts">
console.log('🐔[Welcome.vue-:2] Welcome被加载')
</script>

<template>
  <div class="login-view">
    <div class="window" v-m>
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="less">
.login-view {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: auto;

  .window {
    margin: auto;
    height: 100px;
    width: 100px;
    border: 1px solid;
  }
}
</style>
