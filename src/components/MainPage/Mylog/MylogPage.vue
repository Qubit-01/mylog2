<script setup lang="ts">
import dayjs from 'dayjs'
import type { Log } from '@/types'
import useGlobalStore from '@/stores/global'
import useLogStore from '@/stores/log'

const global = useGlobalStore()
// release
const logStore = useLogStore()
const mylog = logStore.mylog
mylog.getLogs!()


// 编辑的数据
const logEdit = reactive<Log>({
  userid: global.user.id,
  username: global.user.name,
  type: 'log',
  sendtime: dayjs(),
  logtime: dayjs(),
  content: '',
  tags: ["123", "456", "123", "456", "123", "456", "123", "456"],
  imgs: [],
  videos: [],
  audios: [],
  files: [],
  location: [],
  people: [],
  info: {},
})
</script>

<template>
  <div class="mylog-page">

    <LogRelease v-model="logEdit" />

    <div class="time-line">
      <ElTimeline v-infinite-scroll="mylog.addLogs!" :infinite-scroll-disabled="mylog.loading">

        <!-- 编辑预览 -->
        <ElTimelineItem v-if="logEdit.content" timestamp="编辑预览" placement="top">
          <LogMylog :log="logEdit" />
        </ElTimelineItem>

        <!-- 时间线开始 -->
        <template v-for="(log, i) in mylog.list">

          <ElTimelineItem v-if="i != 0 && log.logtime!.year() !== mylog.list[i - 1].logtime!.year()"
            :timestamp="log.logtime!.year().toString()" type='primary' placement="top" />

          <ElTimelineItem :timestamp="log.logtime!.format('YYYY-MM-DD HH:mm')" placement="top">
            <LogMylog :log="log" />
          </ElTimelineItem>

        </template>

        <ElTimelineItem v-if="mylog.loading" timestamp="loading..." placement="top">
          <LogLoading />
        </ElTimelineItem>

        <ElTimelineItem timestamp="origin" placement="top" />
      </ElTimeline>

    </div>
  </div>
</template>

<style scoped lang="less">
.mylog-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  // background-color: var(--m-background-color);

  .time-line {

    .timeline-item {
      padding: var(--padding);
      border-radius: var(--border-radius);
      // backdrop-filter: blur(4px);
    }

    .loading {
      padding: var(--padding);
      border-radius: var(--border-radius);
      height: 150px;
      backdrop-filter: blur(4px);
    }

    .el-timeline {
      padding-left: 2px; // 线到左边的距离

      .el-timeline-item {
        padding-bottom: 8px; // 节点到下边的距离
      }

    }


    // // 时间线时间文本
    // ::v-deep(.el-timeline-item__timestamp) {
    //   color: var(--mini-text-color);
    //   margin-bottom: 5px;
    // }
  }

}
</style>