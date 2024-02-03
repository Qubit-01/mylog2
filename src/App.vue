<!--
  加载页面必须做的事情
-->
<script setup lang="ts">
import useUserStore from '@/stores/user'
const User = useUserStore()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
