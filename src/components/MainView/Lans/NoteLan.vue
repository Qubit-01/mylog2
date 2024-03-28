<script setup lang="ts">
const showBeg = ref(false)
</script>

<template>
  <!-- 公告栏 -->
  <div class="note-lan" v-m>
    <div class="title">公告</div>
    <div class="lanitems">
      <div>
        <a href='https://gitee.com/bit-01/mylog2'><img src='https://gitee.com/bit-01/mylog2/badge/star.svg?theme=dark' alt='star'></img></a>
      </div>
      <!-- <div><span @click="router.push('/about')">关于本站</span></div> -->
      <!-- <div>
        <span @click="router.push('/user?name=Sybit')">更新公告</span>
      </div> -->
      <div>
        <span @click="showBeg = true">联系&资助</span>
      </div>
    </div>
  </div>

  <TeleportBody v-if="showBeg" @close="showBeg = false">
    <div class="beg-window">
      <BegPage />
    </div>
  </TeleportBody>
</template>

<style scoped lang="less">
.note-lan {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: var(--border-radius);
  padding: var(--border-radius);
  font-size: 14px;
  
  .title {
    font-weight: bolder;
    margin-bottom: 8px;
  }
}
</style>
