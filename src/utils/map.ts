import useGlobalStore from '@/stores/global'

/**
 * 高德有个异步的加载器 @amap/amap-jsapi-loader
 * https://lbs.amap.com/api/javascript-api-v2/guide/abc/load#s2
 * 但是组件都必须判断AMap是否存在，才能用，不如直接同步加载
 */
const AMap: any = window.AMap
export default AMap

/**
 * 自定义高德地图hook
 */
export function useMap(
  domRef: globalThis.Ref<HTMLDivElement | undefined>,
  opts: any
) {
  const global = useGlobalStore()
  const map = ref() // 地图对象

  onMounted(() => {
    // 会有 Canvas2D 警告
    map.value = new AMap.Map(domRef.value, {
      viewMode: '2D', // 渲染模式 2D/3D 带俯仰角
      zoom: 11, // 地图级别
      center: [116.397428, 39.90923], // 中心点坐标
      // mapStyle: 'amap://styles/whitesmoke', // 设置地图的显示样式
      ...opts,
    })

    // 监听全局主题变化，自动切换地图样式
    watch(
      () => global.isDark,
      () => {
        map.value.setMapStyle(
          global.isDark ? 'amap://styles/dark' : 'amap://styles/normal'
        )
      }
    )
  })

  return { map }
}

/**
 * 自定义图层，还没暴露
 * https://lbs.amap.com/api/javascript-api-v2/guide/layers/official-layers
 */
type LayerName = 'default' | 'tile' | 'satellite' | 'roadNet' | 'traffic'
/**
 * 获取新图层对象
 * @param layerName 我定义的图层名
 * @returns 图层对象
 */
export function createLayer(layerName: LayerName, opts: any) {
  switch (layerName) {
    case 'default':
      // 默认图层，缩放流畅，可以切换样式
      return new AMap.createDefaultLayer({
        // zooms: [3, 20], //可见级别
        // visible: true, //是否可见
        // opacity: 1, //透明度
        // zIndex: 0, //叠加层级
        ...opts,
      })
    case 'tile':
      // 切片图层，这个图层信息密度大，缩放会模糊，不能切换主题
      return new AMap.TileLayer({
        ...opts,
      })
    case 'satellite':
      // 卫星图层
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
