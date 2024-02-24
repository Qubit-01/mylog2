<script setup lang="ts">
import AMap, { useMap, createLayer } from '@/utils/map'
import { ElButtonGroup, ElRadioGroup } from 'element-plus'

const mapDom = ref<HTMLDivElement>()

const markers = ref<AMap.Marker[]>([])
watchEffect(() => {
  console.log(markers)
})

// 图层
const layers = {
  default: createLayer('default'),
  tile: createLayer('tile'),
  satellite: createLayer('satellite'),
  traffic: createLayer('traffic'),
  roadNet: createLayer('roadNet'),
}

const { map, currentPosition } = useMap(
  mapDom,
  {
    layers: [
      layers.default,
      layers.tile,
      layers.satellite,
      layers.traffic,
      layers.roadNet,
    ],
  },
  (map) => {
    // 点击地图时，设置坐标
    map.on('click', (ev) => {
      addMarker(ev.lnglat)
    })
  }
)

// 添加标记方法封装
const addMarker = (lnglat: [number, number]) => {
  const marker = new AMap.Marker({
    map: map.value!,
    position: lnglat,
  })
  markers.value.push(marker)
  return marker
}

// 设置图层显示隐藏
const setting = reactive<{
  location: [number, number]
  visible: {
    [key: string]: boolean
  }
}>({
  location: [116.397428, 39.90923],
  visible: {
    default: true,
    tile: false,
    satellite: false,
    traffic: false,
    roadNet: false,
  },
})

// 监听图层显示隐藏
for (const k in setting.visible) {
  watchEffect(() => {
    // @ts-ignore
    setting.visible[k] ? layers[k].show() : layers[k].hide()
  })
}
// "103.9017713,30.53006918;104.2544496,30.79041003"

// 移动到指定坐标
const panTo = () => {
  const lnglat = setting.location
  if (lnglat[0] && lnglat[1]) map.value!.panTo(lnglat)
  else ElMessage.error('坐标不正确')
}

// 打标
const setMarker = () => {
  addMarker(setting.location)
}
</script>

<template>
  <div class="map-page" v-m>
    {{ currentPosition }}
    <div class="lnglat-input">
      <ElInput v-model="setting.location[0]" placeholder="lng经度" />
      <ElInput v-model="setting.location[1]" placeholder="lat纬度" />
      <ElButton @click="panTo">定位</ElButton>
      <ElButton @click="setMarker">打标</ElButton>
    </div>

    <div>
      default<ElSwitch v-model="setting.visible.default" type="primary" />
      tile<ElSwitch v-model="setting.visible.tile" type="primary" />
      satellite<ElSwitch v-model="setting.visible.satellite" type="primary" />
      traffic<ElSwitch v-model="setting.visible.traffic" type="primary" />
      roadNet<ElSwitch v-model="setting.visible.roadNet" type="primary" />
    </div>

    <div class="map" ref="mapDom"></div>
  </div>
</template>

<style scoped lang="less">
.map-page {
  border-radius: var(--border-radius);
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  gap: 8px;

  .lnglat-input {
    display: flex;
    gap: 8px;
    > * {
      margin: 0;
    }
  }
  .map {
    height: 400px;
  }
}
</style>
