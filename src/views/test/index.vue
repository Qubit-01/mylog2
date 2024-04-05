<script setup lang="ts">
import { useMap, useTest } from './test'

const mapDom = ref<HTMLDivElement>()

const Test = reactive(useTest())

const Map = reactive(useMap())
</script>

<template>
  <div class="test-page" v-m>
    <div>
      <div>{{ Test.count }}</div>
      <button @click="Test.count++">add</button>
    </div>

    <div>{{ Map.count }}</div>
    <button @click="Map.count++">add</button>

    <div class="map" ref="mapDom"></div>
  </div>
</template>

<style scoped lang="less">
.test-page {
  border-radius: var(--border-radius);
  padding: var(--padding);
}
</style>
