<script setup lang="ts">
import AMap from '@/utils/map'
const map = ref()

onMounted(() => {
  map.value = new AMap.Map('amap') //"amap"为 <div> 容器的 id
})
</script>

<template>
  <div class="edit-location">
    <div id="amap"></div>
  </div>
</template>

<style scoped lang="less">
#amap {
  height: 100px;
  width: 100%;
}
</style>
