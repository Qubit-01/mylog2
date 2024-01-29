import { useDark } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const isDark = useDark()

  const theme = computed(() => isDark.value ? 'light' : 'dark')

  // 触发就切换
  const toggleTheme = (theme: boolean) => {
    isDark.value = theme || !isDark.value
  }

  return { isDark, theme, toggleTheme }
})
