import { getUserByToken } from "@/api/user"
import type { User } from "@/types"
import { deepMerge } from "@/utils"

/**
 * 全局数据
 * 
 * user信息（不含token）
 * token
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
  const router = useRouter()


  // 当前默认用户数据
  const user = reactive<User>({
    id: 0,
    name: '未登录',
    setting: {
      page: {
        theme: 'light',
      }
    }
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
      deepMerge(user, res)
    })
  }

  // 用户相关 ===============================
  // 是否已登录，判断
  const isLogined = computed(() => user.id !== 0)
  // 退出登录，删除 token、pageSetting
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('pageSetting')
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
    user, token, isLogined, logout,
    isDark,
  }
})

export default useGlobalStore
