<script setup lang="ts">
import { getUser } from '@/stores/global'
import useLogStore from '@/stores/log'

const router = useRouter()
const Mylog = useLogStore().mylog

getUser.then(user => Mylog.getLogs!(), null) // 进入页面再获取数据

const tab = ref<string>('timeline')
watch(tab, () => {
  router.push({ name: tab.value })
})
</script>

<template>
  <div class="mylog-page">
    <ElRadioGroup v-model="tab">
      <!-- size="large" -->
      <ElRadioButton label="时间线" value="timeline" />
      <ElRadioButton label="待办" value="todo" />
      <ElRadioButton label="日历" value="calendar" />
    </ElRadioGroup>

    <RouterView />
  </div>
</template>

<style scoped lang="less">
.mylog-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // background-color: var(--m-background-color);
}
</style>
