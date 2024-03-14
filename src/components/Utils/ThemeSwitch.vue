<script setup lang="ts">
import useGlobalStore from '@/stores/global'
import { Sunny, Moon } from '@element-plus/icons-vue'
const Global = useGlobalStore()
</script>

<template>
  <ElSwitch v-model="Global.isDark" class="theme-switch" :active-action-icon="Moon" :inactive-action-icon="Sunny" />
  <!-- style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" -->
</template>

<style scoped lang="less"></style>