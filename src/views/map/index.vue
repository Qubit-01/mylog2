<script setup lang="ts">
import type { Log } from '@/types'
import { flatten } from 'lodash'
import useLogStore from '@/stores/log'
import AMap, {
  useAMap,
  createLayer,
  l2v,
  Markers,
  getPositionByGeo,
} from '@/utils/map'

const Mylog = useLogStore().mylog
const mapDom = ref<HTMLDivElement>()
// 当前显示的log
const log = reactive<{
  list: Log[]
  curIndex: number
}>({
  list: [],
  curIndex: 0,
})

/**
 * 分类的marker
 */
const markers = reactive<{
  act: AMap.Marker // 活动的临时坐标
  // log: AMap.Marker[] // log里面的
  diy: AMap.Marker[] // 用户临时添加的
}>({
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

const aMap = reactive(
  useAMap(mapDom, {
    layers: [
      layers.default,
      layers.tile,
      layers.satellite,
      layers.traffic,
      layers.roadNet,
    ],
  })
)

aMap.init.then(async map => {
  // map.add(markers.cur)
  map.add(markers.act)

  // 点击地图时，设置坐标
  map.on('click', ev => {
    data.input = l2v(ev.lnglat)
    markers.act.setPosition(ev.lnglat)
  })

  if (!Mylog.listAll.length) await Mylog.getLogs()

  // 点集，可以携带数据
  const points: { weight: number; lnglat: AMap.Vector2; log: Log }[] =
    Mylog.listFilter
      .filter(log => log.location.length)
      .map(l => {
        // console.log('🐤', l.location)
        return {
          weight: 1,
          lnglat: l.location[0]!,
          log: l,
        }
      })

  // 点聚合
  const cluster = new AMap.MarkerCluster(map, points, {
    gridSize: 20,
    clusterByZoomChange: true,
    // 聚合点
    renderClusterMarker(context: {
      clusterData: any[]
      count: number
      marker: AMap.Marker
    }) {
      // context属性 marker:当前聚合点，count:当前聚合点内的点数量
      const c = context.count > 50 ? 50 : context.count > 30 ? 30 : 1
      const s = context.count > 50 ? 36 : context.count > 30 ? 30 : 24
      context.marker.setContent(
        `<div class="log-marker gt${c}" style="--size: ${s}px;">${context.count}</div>`
      )
      context.marker.setOffset(new AMap.Pixel(-s / 2, -s / 2))
      context.marker.on('click', e => {
        log.curIndex = 1
        log.list = flatten(
          context.clusterData.map(d => d._amapMarker.originData[0])
        )
          .map((d: any) => d.log)
          .sort((a: Log, b: Log) => b.logtime.diff(a.logtime))
      })
    },
    // 非聚合点 context.marker:当前非聚合点
    renderMarker(context: { data: any[]; count: number; marker: AMap.Marker }) {
      context.marker.setContent('<div class="log-marker"></div>')
      context.marker.setOffset(new AMap.Pixel(-9, -9))
      context.marker.on('click', () => {
        log.curIndex = 1
        log.list = context.data.map(d => d.log)
      })
    },
  })
})

// 添加标记方法封装
const addMarker = (lnglat: [number, number]) => {
  const marker = new AMap.Marker({
    map: aMap.map,
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
  getPositionByGeo(aMap.locationController).then(() => {
    getLocationLoading.value = false
  })
}

/**
 * 移动到指定坐标
 */
const panTo = () => {
  markers.act.setPosition(data.input)
  aMap.map!.panTo(data.input)
}

// 打标
const setMarker = () => {
  addMarker(data.input)
}
</script>

<template>
  <div
    class="map-page"
    v-m
    v-loading="
      aMap.loading && {
        text: aMap.state,
      }
    "
  >
    <div>
      <ElButton @click="currentLocation" :loading="getLocationLoading">
        定位
      </ElButton>
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
    <div class="diy-lnglat">
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

    <div v-if="log.list.length" class="logs">
      <Log
        :log="log.list[log.curIndex - 1]"
        :key="log.list[log.curIndex - 1].id"
      >
        <template #bottom>
          <ElPagination
            small
            background
            layout="prev, pager, next"
            :page-size="1"
            v-model:current-page="log.curIndex"
            :total="log.list.length"
            hide-on-single-page
            style="justify-content: center"
          />
        </template>
      </Log>
    </div>
  </div>
</template>

<style scoped lang="less">
.map-page {
  position: relative;
  border-radius: var(--border-radius);
  padding: var(--padding);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - var(--header-top) - var(--padding) - 60px);

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

  .logs {
    position: absolute;
    bottom: var(--padding);
    left: var(--padding);
    right: var(--padding);
    // width: 100%;
    // display: flex;
  }

  // Marker样式定义
  :deep(.log-marker) {
    --size: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--size);
    width: var(--size);
    border: 1px solid #0f0c;
    border-radius: 50%;
    box-shadow: #000 0px 0px 3px;

    background-color: #0f05;
    &.gt1 {
      background-color: #0f0a;
    }
    &.gt30 {
      background-color: #0f0c;
    }
    &.gt50 {
      background-color: #0f0f;
    }
  }
}
</style>
