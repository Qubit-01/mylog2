<script setup lang="ts">

</script>

<template>
  <header>
    <div class="left">多元记</div>
    <nav>
      <RouterLink to="/">主页</RouterLink>
      <RouterLink to="/mylog">记录</RouterLink>
      <RouterLink to="/login">注册</RouterLink>
    </nav>
    <div class="right">用户名</div>
  </header>
</template>

<style scoped lang="less">
header {
  border: 1px solid red;
  display: flex;
  justify-content: space-between;

  height: 50px;
}
</style>