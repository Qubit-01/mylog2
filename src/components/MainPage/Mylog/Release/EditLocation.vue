<script setup lang="ts">
import AMap, { useMap } from '@/utils/map'

const mapDom = ref<HTMLDivElement>()

// 坐标
const location = defineModel<[[number, number], string] | []>({
  required: true,
})

// 主要location标记
const marker = new AMap.Marker({
  title: '记录位置',
})

const { map } = useMap(mapDom, {}, (map) => {
  map.add(marker)

  // 点击地图时，设置坐标
  map.on('click', (ev) => {
    const lnglat = ev.lnglat
    marker.setPosition(lnglat)
    location.value[0] = [lnglat.lng, lnglat.lat]
    map.panTo(location.value[0]!, 1000)
  })
})

// 当坐标变化时
watch(location, () => {
  map.value!.panTo(location.value[0]!)
  marker.setPosition(location.value[0]!)
})
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
