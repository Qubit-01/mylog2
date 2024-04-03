<script setup lang="ts">
import useLogStore from '@/stores/log'
import AMap, {
  useMap,
  createLayer,
  getLocation,
  l2v,
  Markers,
} from '@/utils/map'

const Mylog = useLogStore().mylog
const mapDom = ref<HTMLDivElement>()

/**
 * 分类的marker
 */
const markers = reactive<{
  cur: AMap.Marker // 用户当前的
  act: AMap.Marker // 活动的临时坐标
  // log: AMap.Marker[] // log里面的
  diy: AMap.Marker[] // 用户临时添加的
}>({
  cur: Markers.red(),
  // act: new AMap.Marker(),
  act: Markers.point(),
  // log: [],
  diy: [],
})

// 图层
const layers = {
  default: createLayer('default'),
  tile: createLayer('tile'),
  satellite: createLayer('satellite'),
  traffic: createLayer('traffic'),
  roadNet: createLayer('roadNet'),
}

const { map, curLocation } = useMap(
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
  async (map, p) => {
    data.location = l2v(p)
    markers.cur.setPosition(l2v(p))
    map.add(markers.cur)
    map.add(markers.act)

    // 点击地图时，设置坐标
    map.on('click', ev => {
      data.input = l2v(ev.lnglat)
      markers.act.setPosition(ev.lnglat)
    })

    if (!Mylog.listAll.length) await Mylog.getLogs()

    Mylog.listFilter
      .filter(log => log.location.length)
      .map(log => log.location[0])
      .forEach(p => Markers.point({ color: 'green' }, { position: p, map }))
  }
)

// 添加标记方法封装
const addMarker = (lnglat: [number, number]) => {
  const marker = new AMap.Marker({
    map: map.value!,
    position: lnglat,
  })
  markers.diy.push(marker)
  return marker
}

// 设置图层显示隐藏
const data = reactive<{
  location: [number, number]
  input: [number, number]
  visible: {
    [key: string]: boolean
  }
}>({
  location: [0, 0],
  input: [116.397428, 39.90923],
  visible: {
    default: true,
    tile: false,
    satellite: false,
    traffic: false,
    roadNet: false,
  },
})

// 监听图层显示隐藏
for (const k in data.visible) {
  watchEffect(() => {
    // @ts-ignore
    data.visible[k] ? layers[k].show() : layers[k].hide()
  })
}
// "103.9017713,30.53006918;104.2544496,30.79041003"

/**
 * 定位到当前
 */
const getLocationLoading = ref(false)
const currentLocation = () => {
  getLocationLoading.value = true
  getLocation().then(p => {
    data.location = l2v(p)
    map.value!.panTo(p)
    getLocationLoading.value = false
  })
}

/**
 * 移动到指定坐标
 */
const panTo = () => {
  markers.act.setPosition(data.input)
  map.value!.panTo(data.input)
}

// 打标
const setMarker = () => {
  addMarker(data.input)
}
</script>

<template>
  <div class="map-page" v-m>
    <div>
      <ElButton @click="currentLocation" :loading="getLocationLoading"
        >定位</ElButton
      >
      {{ data.location }}
    </div>
    <div class="lnglat-input">
      <ElInput v-model="data.input[0]" placeholder="lng经度" />
      <ElInput v-model="data.input[1]" placeholder="lat纬度" />
      <ElButton @click="panTo" :disabled="!data.input[0] || !data.input[1]">
        转到
      </ElButton>
      <ElButton @click="setMarker">打标</ElButton>
    </div>

    <div class="control-layer">
      <ElSwitch
        v-model="data.visible.default"
        type="primary"
        active-text="default"
      />
      <ElSwitch v-model="data.visible.tile" type="primary" active-text="tile" />
      <ElSwitch
        v-model="data.visible.satellite"
        type="primary"
        active-text="satellite"
      />
      <ElSwitch
        v-model="data.visible.traffic"
        type="primary"
        active-text="traffic"
      />
      <ElSwitch
        v-model="data.visible.roadNet"
        type="primary"
        active-text="roadNet"
      />
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
  height: calc(100vh - var(--header-top) - var(--padding) - 10px);

  .lnglat-input {
    display: flex;
    gap: 8px;
    > * {
      margin: 0;
    }
  }

  .control-layer {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .map {
    flex: 1;
    // height: calc(100vh - var(--header-top));
  }
}
</style>
