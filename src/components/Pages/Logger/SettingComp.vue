<script setup lang="ts">
import useUserStore from '@/stores/user'

const Setting = useUserStore().setting
const activeTab = ref(1)
</script>

<template>
  {{ activeTab }}
  <div class="logger-comp" v-m>
    <ElCollapse>
      <ElCollapseItem title="页面设置" :name="1">
        <div class="page-setting">页面设置</div>
      </ElCollapseItem>
      <ElCollapseItem title="记录设置" :name="2">
        <div class="mylog-setting">我的日志设置</div>
      </ElCollapseItem>
      <ElCollapseItem title="人脉设置" :name="3">
        <div class="relation-setting">人脉设置</div>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<style scoped lang="less"></style>
