import type { isVisible } from 'element-plus/es/utils/index.mjs'; import type {
isVisible } from 'element-plus/es/utils/index.mjs'; import type {
setBlockTracking } from 'vue'; import type { ElButton } from 'element-plus';
<script setup lang="ts">
import AMap, { useMap, createLayer } from '@/utils/map'

const mapDom = ref<HTMLDivElement>()

const layers = {
  default: createLayer('default'),
  tile: createLayer('tile'),
  traffic: createLayer('traffic'),
  satellite: createLayer('satellite'),
  roadNet: createLayer('roadNet'),
}

const { map } = useMap(mapDom, {
  layers: [
    layers.default,
    layers.tile,
    layers.traffic,
    layers.satellite,
    layers.roadNet,
  ],
})

const setting = reactive({
  visible: {
    default: true,
    tile: false,
    traffic: false,
    satellite: false,
    roadNet: false,
  },
})

watchEffect(() => {
  setting.visible.default ? layers.default.show() : layers.default.hide()
})
watchEffect(() => {
  setting.visible.tile ? layers.tile.show() : layers.tile.hide()
})
watchEffect(() => {
  setting.visible.traffic ? layers.traffic.show() : layers.traffic.hide()
})
watchEffect(() => {
  setting.visible.satellite ? layers.satellite.show() : layers.satellite.hide()
})
watchEffect(() => {
  setting.visible.roadNet ? layers.roadNet.show() : layers.roadNet.hide()
})

const visible = computed({
  get() {},
})
</script>

<template>
  <div class="map-page" v-m>
    default<ElSwitch v-model="setting.visible.default" type="primary" />
    tile<ElSwitch v-model="setting.visible.tile" type="primary" />
    traffic<ElSwitch v-model="setting.visible.traffic" type="primary" />
    satellite<ElSwitch v-model="setting.visible.satellite" type="primary" />
    roadNet<ElSwitch v-model="setting.visible.roadNet" type="primary" />
    <div class="map" ref="mapDom"></div>
  </div>
</template>

<style scoped lang="less">
.map-page {
  border-radius: var(--border-radius);
  padding: var(--padding);
  .map {
    height: 400px;
  }
}
</style>
