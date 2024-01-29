<script setup lang="ts">

</script>

<template>
  <div class="home">
    <div v-for="i in 100" class="log" v-m>log</div>
  </div>
</template>

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  .log {
    border-radius: var(--border-radius);
    padding: var(--padding)
  }
}
</style>