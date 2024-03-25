import { getUserByToken } from '@/api/user'
import type { User } from '@/types'
import { deepMerge } from '@/utils'

/**
 * 获取用户接口全局只调用一次，所以用Promise
 * 通过token获取用户信息之后的promise，但是很多页面都是直接用token发请求
 * 成功返回拿到的user数据，没有token或者错误token都返回空
 */
export const getUser: Promise<User> = new Promise((resolve, reject) => {
  const token = localStorage.getItem('token')
  if (token)
    getUserByToken({ token: token }).then(res => {
      if (res) resolve(res)
      else {
        ElMessage.error('用户登录信息已过期或错误，请重新登录')
        reject()
      }
    })
  else reject()
})

/**
 * 哪些信息需要存入本地？
 * 1. token
 * 2. setting.pageSetting 这个页面会直接使用的
 *
 * 流程：
 * 默认值 》 本地存储 》 云端获取
 */

/**
 * Global 全局数据的类型
 */
interface Global {
  /**
   * 信息（不含token）就是User数据，里面没有方法
   */
  user: User
  token: string
  /**
   * 是否已登录（计算属性）
   */
  isLogined: boolean
  /**
   * 是否是暗黑模式（计算属性）
   * 监视 user.setting.page.theme 变化
   * 改变 html class属性
   */
  isDark: boolean
  /**
   * 退出登录方法
   */
  logout: () => void
}

export const useGlobalStore: () => Global = defineStore('global', () => {
  // 当前默认用户数据
  const user = reactive<User>({
    id: '0',
    name: '',
    setting: {
      page: {
        theme: localStorage.getItem('theme') || 'light',
      },
    },
  })

  // const token = ref(localStorage.getItem('token') || '')
  /**
   * 通过设置 token 的 get 和 set 方法，实现 token 的存储和删除
   */
  const token = computed({
    get() {
      return localStorage.getItem('token') || ''
    },
    set(v) {
      if (v) localStorage.setItem('token', v)
      else localStorage.removeItem('token')
    },
  })

  // 云端获取用户信息
  getUser
    .then(res => {
      deepMerge(user, res)
    })
    .catch(() => {
      token.value = ''
    })

  // 先去本地存储获取页面设置
  const pageSetting = localStorage.getItem('pageSetting')
  if (pageSetting) deepMerge(user.setting!, JSON.parse(pageSetting))

  // 用户相关 ===============================
  /**
   * 是否已登录，判断。
   * 本来也是用id是否等于0判断的，但是后来感觉不对，要用token是否有，才是同步的
   * 路由这种优先级很高的东西，同步就尤为重要
   */
  const isLogined = computed(() => !!token.value)
  // 退出登录，删除 token、pageSetting
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('pageSetting')
    location.href = '/'
  }

  // 主题相关 ===============================

  // 是否是暗黑模式
  const isDark = computed<boolean>({
    get: () => user.setting.page.theme === 'dark',
    set: v => (user.setting.page.theme = v ? 'dark' : 'light'),
  })

  // 主题切换
  const html = document.getElementsByTagName('html')[0]
  watchEffect(() => {
    localStorage.setItem('theme', user.setting.page.theme!)
    html.className = user.setting.page.theme!
  })

  return {
    user,
    token,
    isLogined,
    logout,
    isDark,
  }
})

export default useGlobalStore
