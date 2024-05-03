<script setup lang="ts">
import type { Log } from '@/types'
import dayjs from 'dayjs'

const todos = reactive<Log[]>([
  {
    userid: '1',
    username: 'sybit',
    type: 'todo',
    sendtime: dayjs(),
    logtime: dayjs(),
    content:
      '达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶达瓦达瓦大屋顶',
    tags: [],
    imgs: [],
    videos: [],
    audios: [],
    files: [],
    location: [],
    people: [],
    info: {
      todo: {
        complete: true,
        level: 1,
      },
    },
  },
  {
    userid: '1',
    username: 'sybit',
    type: 'todo',
    sendtime: dayjs(),
    logtime: dayjs(),
    content: '算法撒旦飞洒地方',
    tags: [],
    imgs: [],
    videos: [],
    audios: [],
    files: [],
    location: [],
    people: [],
    info: {
      todo: {
        complete: false,
        level: 1,
      },
    },
  },
  {
    userid: '1',
    username: 'sybit',
    type: 'todo',
    sendtime: dayjs(),
    logtime: dayjs(),
    content: '发士大夫撒旦发射点发生',
    tags: [],
    imgs: [],
    videos: [],
    audios: [],
    files: [],
    location: [],
    people: [],
    info: {
      todo: {
        complete: false,
        level: 1,
      },
    },
  },
])
</script>

<template>
  <div class="todo-comp">
    <LogTodo v-for="todo of todos" :log="todo" />
  </div>
</template>

<style scoped lang="less">
.todo-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
