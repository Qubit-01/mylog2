<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

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
