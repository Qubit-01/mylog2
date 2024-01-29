<!--
  垂直方向的中间部分，包含左右栏，和主要展示内容（是个路由组件）
-->
<script setup lang="ts">

</script>

<template>
  <div class="main">
    <div class="center">
      <div class="middle">
        <RouterView />
      </div>
      <div class="left">左栏</div>
      <div class="right">
        <OneSentence />
      </div>

    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  display: flex;
  justify-content: center;

  // 两边栏宽度
  --width-lan: 130px;

  .center {
    width: var(--center-width);
    display: flex;
    gap: var(--gap);

    .middle {
      order: 2;
      flex: 1;
    }

    .left {
      order: 1;
      width: var(--width-lan);
    }

    .right {
      order: 3;
      width: var(--width-lan);
    }

    .left,
    .right {
      >div {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: var(--border-radius);
        padding: var(--border-radius);
      }
    }
  }
}
</style>