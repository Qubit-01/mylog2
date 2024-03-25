<script setup lang="ts">
import { getUser } from '@/stores/global'
import useLogStore from '@/stores/log'
const logStore = useLogStore()
const mylog = logStore.mylog

// 拿到编辑的数据
const logReleaseDom = ref()

getUser
  .then(user => {
    mylog.getLogs!() // 进入页面再获取数据
  })
  .catch(() => {})
</script>

<template>
  <div class="timeline-comp">
    <LogRelease ref="logReleaseDom" />

    <ElTimeline
      v-infinite-scroll="mylog.addLogs!"
      :infinite-scroll-disabled="mylog.loading"
    >
      <!-- 编辑预览 -->
      <!-- <ElTimelineItem
      v-if="logReleaseDom?.logEdit.content"
      timestamp="编辑预览"
      placement="top"
    >
      <LogMylog :log="logReleaseDom?.logEdit" />
    </ElTimelineItem> -->

      <!-- 时间线开始 -->
      <template v-for="(log, i) in mylog.list">
        <ElTimelineItem
          v-if="i != 0 && log.logtime!.year() !== mylog.list[i - 1].logtime!.year()"
          :timestamp="log.logtime!.year().toString()"
          type="danger"
          placement="top"
        />

        <ElTimelineItem
          :timestamp="log.logtime!.format('YYYY-MM-DD HH:mm')"
          :type="log.type === 'public' ? 'warning' : undefined"
          placement="top"
        >
          <LogMylog :log="log" :key="log.id" />
        </ElTimelineItem>
      </template>

      <ElTimelineItem
        v-if="mylog.loading"
        timestamp="loading..."
        placement="top"
      >
        <LogLoading />
      </ElTimelineItem>

      <ElTimelineItem timestamp="origin" placement="top" />
    </ElTimeline>
  </div>
</template>

<style scoped lang="less">
.timeline-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);

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
</style>
