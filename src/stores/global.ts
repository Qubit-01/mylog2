import { getUserByToken } from '@/api/user'
import type { User } from '@/types'
import { deepMerge } from '@/utils'

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

  // 先去本地存储获取
  const pageSetting = localStorage.getItem('pageSetting')
  if (pageSetting) {
    deepMerge(user.setting!, JSON.parse(pageSetting))
  }

  // 再去云端获取
  const token = ref(localStorage.getItem('token') || '')

  if (token.value) {
    getUserByToken({ token: token.value }).then((res) => {
      if (res) deepMerge(user, res)
    })
  }

  // 用户相关 ===============================
  // 是否已登录，判断
  const isLogined = computed(() => user.id !== '0')
  // 退出登录，删除 token、pageSetting
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('pageSetting')
    location.reload()
  }

  // 主题相关 ===============================

  // 是否是暗黑模式
  const isDark = computed<boolean>({
    get: () => user.setting.page.theme === 'dark',
    set: (v) => (user.setting.page.theme = v ? 'dark' : 'light'),
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
