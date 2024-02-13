<script setup lang="ts">
const emit = defineEmits(['close'])
</script>

<template>
  <teleport to="body">
    <div class="mask" @click.self="emit('close')">
      <div class="window">
        <slot>弹窗内容</slot>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="less">
.mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;

  height: 100vh;
  width: 100vw;
  background-color: #111a;
  backdrop-filter: blur(4px);

  display: flex;

  .window {
    margin: auto;
    max-height: 100vh;
    max-width: 100vw;
    overflow: auto;
  }
}
</style>