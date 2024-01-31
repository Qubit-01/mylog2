<script setup lang="ts">
import type { Log } from '@/types'

const { log } = defineProps<{
  log: Log
}>()
console.log(log)


</script>

<template>
  <div class="log" v-m>
    <div class="title">
      {{ log.info?.title }}12
    </div>
    <div>{{ log.username }}</div>
    <div>{{ log.sendtime }}</div>
    <div>{{ log.logtime }}</div>
    <div>{{ log.content }}</div>
    <div>{{ log.tags }}</div>
    <div>{{ log.imgs }}</div>
    <div>{{ log.videos }}</div>
    <div>{{ log.audios }}</div>
    <div>{{ log.files }}</div>
    <div>{{ log.location }}</div>
    <div>{{ log.people }}</div>
    <div>{{ log.info?.link }}</div>
    <div>{{ log.info?.markdown }}</div>
    {{ log.info }}
  </div>
</template>

<style scoped lang="less">
.log {
  border-radius: var(--border-radius);
  padding: var(--padding);

  .title {
    border: 1px solid;
    font-size: 1.5rem;
    font-weight: bolder;
  }
}
</style>