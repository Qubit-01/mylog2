<script setup lang="ts">
import AMap, { useMap } from '@/utils/map'

const mapDom = ref<HTMLDivElement>()

const { map } = useMap(mapDom, {})
</script>

<template>
  <div class="edit-location">
    <div class="map" ref="mapDom"></div>
  </div>
</template>

<style scoped lang="less">
.edit-location {
  .map {
    border-radius: var(--border-radius);
    height: 200px;
    // width: 100%;
  }
}
</style>
