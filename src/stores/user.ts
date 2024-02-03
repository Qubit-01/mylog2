export const useUserStore = defineStore('user', () => {

  const loading = ref(true)



  const isDark = ref(true)

  const theme = computed(() => isDark.value ? 'light' : 'dark')



  watchEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (isDark.value) html.classList.add('dark')
    else html.classList.remove('dark')
  })

  // 触发就切换
  const toggleTheme = (theme: boolean) => {
    isDark.value = theme || !isDark.value
  }




  

  return { isDark, theme, toggleTheme }
})

export default useUserStore
