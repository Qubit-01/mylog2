import useGlobalStore from '@/stores/global'
import '@amap/amap-jsapi-types'

/**
 * 高德有个异步的加载器 @amap/amap-jsapi-loader
 * https://lbs.amap.com/api/javascript-api-v2/guide/abc/load#s2
 * 但是组件都必须判断AMap是否存在，才能用，不如直接同步加载
 */
type AMapType = typeof globalThis.AMap
interface AMap extends AMapType {
  CitySearch?: any
  Geolocation?: any
}
const AMap: AMap = window.AMap
export default AMap

/**
 * 自定义高德地图hook
 * @param domRef Dom的Ref对象
 * @param opts 地图初始化的配置
 * @param callback 初始化后的回调，传入地图对象
 * @returns 地图对象
 */
export function useMap(
  domRef: globalThis.Ref<HTMLDivElement | undefined>,
  opts: any = {},
  callback: (map: AMap.Map) => void = () => {}
) {
  const global = useGlobalStore()
  let map = shallowRef<AMap.Map>() // 地图对象

  position().then((p) => {
    map.value!.panTo(p)
  })

  onMounted(() => {
    // 会有 Canvas2D 警告
    map.value = new AMap.Map(domRef.value!, {
      zoom: 11, // 地图级别
      // mapStyle: 'amap://styles/whitesmoke', // 设置地图的显示样式
      ...opts,
    })

    callback(map.value)

    // 监听全局主题变化，自动切换地图样式
    watch(
      () => global.isDark,
      () => {
        map.value!.setMapStyle(
          global.isDark ? 'amap://styles/dark' : 'amap://styles/normal'
        )
      }
    )
  })

  onUnmounted(() => {
    map.value!.destroy()
  })

  return { map, currentPosition }
}

type LayerName = 'default' | 'tile' | 'satellite' | 'roadNet' | 'traffic'
/**
 * 获取新图层对象
 * https://lbs.amap.com/api/javascript-api-v2/guide/layers/official-layers
 * @param layerName 我定义的图层名
 * @returns 图层对象
 */
export function createLayer(layerName: LayerName, opts: any = {}) {
  switch (layerName) {
    case 'default':
      // 经典地图，缩放流畅，可以切换样式，字永远在顶层，图永远在底层，会大面积覆盖
      return AMap.createDefaultLayer({
        // zooms: [3, 20], //可见级别
        // visible: true, //是否可见
        // opacity: 1, //透明度
        // zIndex: 1, //叠加层级
        ...opts,
      })
    case 'tile':
      // 旅游地图，字和图在一层，缩放会模糊，不能切换主题，会大面积覆盖
      return new AMap.TileLayer({
        ...opts,
      })
    case 'satellite':
      // 卫星地图，没有字，会大面积覆盖
      return new AMap.TileLayer.Satellite({
        ...opts,
      })
    case 'roadNet':
      // 路网图层
      return new AMap.TileLayer.RoadNet({
        ...opts,
      })
    case 'traffic':
      // 实时交通图层
      return new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 180, //刷新间隔，默认180s
        ...opts,
      })
  }
}

/**
 * 同时IP和浏览器定位，优先选择浏览器定位结果
 * @returns
 */
export function position(): Promise<any> {
  return new Promise((resolve, reject) => {
    geolocation()
      .then((p: any) => {
        resolve(p)
      })
      .catch(() => {
        citySearch().then((p) => {
          resolve(p)
        })
      })
  })
}

/**
 * IP定位，获取当前城市
 * @returns Promise<>
 */
export function citySearch(): Promise<any> {
  return new Promise((resolve, reject) => {
    // IP定位，获取当前城市
    AMap.plugin('AMap.CitySearch', () => {
      const citySearch = new AMap.CitySearch()
      citySearch.getLocalCity((status: string, result: any) => {
        if (status === 'complete' && result.info === 'OK')
          resolve(result.bounds.getCenter())
        else reject([status, result])
      })
    })
  })
}

/**
 * 浏览器定位
 * @returns
 */
export function geolocation(): Promise<any> {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Geolocation', function () {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 设置定位超时时间，默认：无穷大
        offset: [10, 20], // 定位按钮的停靠位置的偏移量
        zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        position: 'RB', //  定位按钮的排放位置,  RB表示右下
      })

      geolocation.getCurrentPosition((status: string, result: any) => {
        console.log(status, result)
        if (status == 'complete') resolve(result.position)
        else reject([status, result])
      })
    })
  })
}

/**
 * 记录一下常用方法
 */
interface Map {
  // 动态改变地图样式
  // setMapStyle('amap://styles/whitesmoke')
  /**
   * 图层
   * 更多官方图层 https://lbs.amap.com/api/javascript-api-v2/guide/layers/official-layers
   */
  // 实时交通图层
  // const traffic = new AMap.TileLayer.Traffic({
  //   autoRefresh: true, //是否自动刷新，默认为false
  //   interval: 180, //刷新间隔，默认180s
  // })
  // map.add(traffic) / map.remove(traffic)
  // traffic.show() / traffic.hide()
}
