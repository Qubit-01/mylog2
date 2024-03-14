import { getUserByToken } from '@/api/user'
import type { User } from '@/types'
import { deepMerge } from '@/utils'

/**
 * 全局数据
 *
 * global
 *   user信息（不含token）就是User数据，里面没有方法
 *   token
 *   [计算]
 *   cosPath cos路径
 *   isLogined 是否已登录
 *   isDark 是否是暗黑模式
 *   [方法]
 *   logout 退出登录方法
 *
 * 哪些信息需要存入token？
 * setting.pageSetting 这个页面会直接使用的
 *
 * 流程：
 * 默认值 》 本地存储 》 云端获取
 *
 *
 *
 */

export const useGlobalStore = defineStore('global', () => {
  // 当前默认用户数据
  const user = reactive<User>({
    id: '0',
    name: '',
    setting: {
      page: {
        theme: 'light',
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
    getUserByToken({ token: token.value }).then(res => {
      if (res) deepMerge(user, res)
    })
  }

  // 用户相关 ===============================
  // 是否已登录，判断
  const isLogined = computed(() => user.id !== '0')
  // 用户的cos路径方便后续使用
  const cosPath = computed(() => `users/${user.id}/mylog/`)
  // 退出登录，删除 token、pageSetting
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('pageSetting')
    location.reload()
  }

  // 主题相关 ===============================

  // 是否是暗黑模式
  const isDark = computed({
    get: () => user.setting.page.theme === 'dark',
    set: (val: boolean) => {
      user.setting.page.theme = val ? 'dark' : 'light'
    },
  })

  // 主题切换
  const html = document.getElementsByTagName('html')[0]
  watchEffect(() => {
    if (isDark.value) html.classList.add('dark')
    else html.classList.remove('dark')
  })

  return {
    user,
    token,
    isLogined,
    cosPath,
    logout,
    isDark,
  }
})

export default useGlobalStore
