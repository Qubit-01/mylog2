<script setup lang="ts">
import axios from 'axios'

const logs = reactive({
  list: []
})

axios.get('log/get_logs_home', {
  params: { skip: 0, limit: 10 },
}).then(res => {
  logs.list = res.data
})
</script>

<template>
  <div class="home">
    <div v-for="i in logs.list" class="log" v-m>
      <Log :log="i"></Log>
    </div>
  </div>
</template>

<style scoped lang="less">
.home {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  overflow: hidden;

  .log {
    border-radius: var(--border-radius);
    padding: var(--padding)
  }
}
</style>