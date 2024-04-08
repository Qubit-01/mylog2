import useGlobalStore from '@/stores/global'
import '@amap/amap-jsapi-types'

const AMap: AMap = window.AMap
/**
 * 高德有个异步的加载器 @amap/amap-jsapi-loader
 * https://lbs.amap.com/api/javascript-api-v2/guide/abc/load#s2
 * 但是组件都必须判断AMap是否存在，才能用，不如直接同步加载
 *
 * 插件会直接在AMAP对象上加属性，但是TS不知道，这里加上
 */
type AMapType = typeof globalThis.AMap
interface AMap extends AMapType {
  CitySearch?: any // IP定位
  Geolocation?: any // 浏览器定位
  Geocoder?: any // 地址解析
}

// 给AMap添加需要用的所有功能
const addPlugins = new Promise<void>((resolve, reject) => {
  AMap.plugin(['AMap.CitySearch', 'AMap.Geolocation', 'AMap.Geocoder'], resolve)
})

/****************
 * 定位
 * Ip定位
 * - getCityByIp 获取城市，不要权限，可能为空
 * Geo定位
 * - getPositionByGeo 获取当前精确位置，要权限
 * - getCityInfoByGeo 获取城市信息，不要权限，不会为空
 ****************/

/**
 * IP定位，根据IP返回对应城市信息。
 * 不会要权限，但是有代理时不会返回结果
 *
 * @param ip 指定ip查询，可以不传，就自动获取ip
 * status:
 *   complete => result为CitySearchResult
 *   error => result为错误信息info
 *   no_data => 代表检索返回0结果，result空对象
 * @returns Promise<{bounds.getCenter()才是中心点, ...}>
 */
export async function getCityByIp(ip?: string): Promise<any> {
  await addPlugins
  const citySearch = new AMap.CitySearch()
  return new Promise((resolve, reject) => {
    const cb = (status: string, result: any) => {
      console.info('getCityByIp', status, result)
      if (status === 'complete' && result.info === 'OK') resolve(result)
      else reject({ status, result })
    }
    if (ip) citySearch.getCityByIp(ip, cb)
    else citySearch.getLocalCity(cb)
  })
}

/**
 * 公共的定位对象
 * 浏览器定位对象，用的比较多，这里直接抽出来，构造时浏览器不会发起询问，调用方法时会
 * 融合了浏览器定位、高精度IP定位、安卓定位sdk辅助定位等多种手段，提供了获取当前准确位置、获取当前城市信息、持续定位(浏览器定位)等功能。
 * 默认情况下，PC端先精确IP定位，失败后浏览器定位；手机端先浏览器定位，失败后IP定位
 *
 * 还可以通过事件监听获取定位结果
 * @see https://lbs.amap.com/api/javascript-api/reference/location#m_AMap.CitySearch
 */
export const getGeolocation = addPlugins.then(() => {
  return new AMap.Geolocation({
    enableHighAccuracy: true, // 是否使用高精度定位，默认：true
    timeout: 10000, // 设置定位超时时间，默认：无穷大
    // 如果要让地图对象使用定位控件，这些属性默认
    buttonPosition: 'LT',
    // buttonOffset: new AMap.Pixel(10, 20), // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
    // showCircle: true, // 定位成功并且有精度信息时，是否用一个圆圈circle表示精度范围, true
    // panToLocation: true, // 定位成功后，是否把定位得到的坐标设置为地图中心点坐标, true
  })
})

/**
 * 获取当前位置，浏览器定位，会要权限
 * getCurrentPosition方法返回的数据也就position有用，
 *
 * 没有权限时，不会有坐标
 * error =>
 *     message: "Get ipLocation failed.Geolocation permission denied."
 *     originMessage: "User denied Geolocation"
 * @returns Promise<{position坐标对象, ...}>
 */
export async function getPositionByGeo(): Promise<any> {
  const geolocation = await getGeolocation
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition((status: string, result: any) => {
      console.info('getPositionByGeo', status, result)
      if (status == 'complete') resolve(result)
      else reject({ status, result })
    })
  })
}

/**
 * 获取当前城市信息，浏览器定位，不会要权限
 * 而且在使用代理时，也会通过ip返回结果
 * @returns Promise<{position坐标数组, ...}>
 */
export async function getCityInfoByGeo(): Promise<any> {
  const geolocation = await getGeolocation
  return new Promise((resolve, reject) => {
    geolocation.getCityInfo((status: string, result: any) => {
      console.info('getCityInfoByGeo', status, result)
      if (status === 'complete') resolve(result)
      else reject({ status, result })
    })
  })
}

/**
 * 不管有没有权限都要给出一个坐标
 * @returns
 */
export async function getPosition(): Promise<AMap.LngLat> {
  const res = await Promise.allSettled([getPositionByGeo(), getCityInfoByGeo()])
  if (res[0].status === 'fulfilled') return res[0].value.position
  if (res[1].status === 'fulfilled') return res[1].value.position
  else return Promise.reject(res)
}

/**
 * 坐标转描述
 * @param p
 * @returns Promise<string>
 */
export async function getAddress(p: AMap.Vector2): Promise<any> {
  await addPlugins
  const geocoder = new AMap.Geocoder({
    // city: '',
    // radius: 1000,
    // batch: false,
    // extensions: 'all',
  })
  return new Promise((resolve, reject) => {
    geocoder.getAddress(p, (status: string, res: any) => {
      if (status === 'complete' && res.info === 'OK') resolve(res.regeocode)
      else reject([status, res])
    })
  })
}

/**
 * 自定义高德地图hook
 * 建议用的时候用reactive包裹，不要用Map当变量名！！！推荐用aMap
 *
 * 如果考虑用户不给定位权限的话，太麻烦了，用户必须给定位权限
 * @param domRef Dom的Ref对象
 * @param opts 地图初始化的配置
 * @param config 配置项，默认开启浏览器定位，getCenter就是精确点
 * @param callback 初始化后的回调，传入地图对象
 */
export function useAMap(
  domRef: globalThis.Ref<HTMLDivElement | undefined>,
  opts: any = {}
) {
  // 17602156171
  const global = useGlobalStore()

  const map = shallowRef<AMap.Map>()
  const state = ref<string>('地图加载中...')

  // 新建定位控件，不要用公共的
  const geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, //是否使用高精度定位，默认:true
    timeout: 10000, //超过10秒后停止定位，默认：无穷大
    maximumAge: 0, //定位结果缓存0毫秒，默认：0
    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    showButton: true, //显示定位按钮，默认：true
    buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
    zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  })

  geolocation.getCurrentPosition()

  const init = new Promise<AMap.Map>((resolve, reject) => {
    onMounted(async () => {
      const rawMap = new AMap.Map(domRef.value!, {
        zoom: 15, // 地图级别
        // center: await curLocation,
        mapStyle: global.isDark ? 'amap://styles/dark' : 'amap://styles/normal', // 设置地图的显示样式
        ...opts,
      })

      rawMap.addControl(geolocation)
      // geolocation.getCurrentPosition() // 进入页面就定位
      map.value = rawMap
      resolve(rawMap)

      // 监听全局主题变化，自动切换地图样式
      watch(
        () => global.isDark,
        () => {
          rawMap.setMapStyle(
            global.isDark ? 'amap://styles/dark' : 'amap://styles/normal'
          )
        }
      )
    })
  })

  onUnmounted(() => {
    map.value!.destroy()
  })

  return { map, init, state, geolocation }
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
 * 获取预设Maker
 * @see https://lbs.amap.com/api/javascript-api-v2/tutorails/add-marker
 * @see https://lbs.amap.com/api/javascript-api-v2/documentation#marker
 * @returns Marker对象
 */
export const Markers = {
  red: (opts?: AMap.MarkerOptions) =>
    new AMap.Marker({
      content: `<img style="height: 34px; width: 25px" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">`,
      offset: new AMap.Pixel(-13, -30),
      ...opts,
    }),
  point: (
    config?: { color?: string; size?: string },
    opts?: AMap.MarkerOptions
  ) =>
    new AMap.Marker({
      content: `<div style="width: ${config?.size || '16px'}; height: ${
        config?.size || '16px'
      }; border-radius: 50%; background-color: ${
        config?.color || 'blue'
      };"></div>`,
      offset: new AMap.Pixel(-6, -6),
      ...opts,
    }),
}

/**
 * LngLat类型坐标转换为Vector2类型坐标
 * 如果传入不是LngLat，就原样输出
 * @param p LngLat类型坐标
 * @returns Vector2类型坐标，就是 [number, number]
 */
export function l2v(p: AMap.LngLat): AMap.Vector2 {
  return [p.lng, p.lat]
}

/**
 * LngLat类型坐标转换为Vector2类型坐标
 * 如果传入不是LngLat，就原样输出
 * @param p LngLat类型坐标
 * @returns Vector2类型坐标，就是 [number, number]
 */
export function v2l(p: AMap.Vector2): AMap.LngLat {
  return {la}
  return [p.lng, p.lat]
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

export default AMap
