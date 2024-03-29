<script setup lang="ts">
import type { Log } from '@/types'
import dayjs from 'dayjs'
import useUserStore from '@/stores/user'
import { delLog, rlsLog } from '@/stores/log'
import useLogStore from '@/stores/log'

const Setting = useUserStore().setting
const Mylog = useLogStore().mylog

// { "isSelected": true, "type": "current-month", "day": "2022-10-26", "date": "2022-10-26T01:21:04.150Z" }
const valueCalendar = ref<Date>(new Date()) // 日历选中的日期

// 给选中日期绑定对应tag
const clickTag = (tag: string) => {
  rlsLog({
    logtime: dayjs(valueCalendar.value),
    content: tag,
    type: 'tag',
  })
}

// 点击日历格子里的标签关闭
const tabNoteClose = (tag: Log) => {
  delLog(tag)
}
</script>

<template>
  <div class="calendar-comp">
    <!-- {{ Note.tags }} -->
    <!-- {{dayjs(valueCalendar).format("YYYY-MM-DD HH:mm:ss")}} -->

    <div class="calendar-main" v-m>
      <div>
        <EditTags
          v-model="Setting.mylog.calendarTags"
          :clickTag="clickTag"
          size="large"
          closable
        />
      </div>
      <!-- 日历 -->
      <ElCalendar v-model="valueCalendar">
        <!-- 单元格 -->
        <template #date-cell="{ data }">
          <div>
            {{ dayjs(data.date).format('D') }}<br />
            <div class="cell-tags">
              <ElTag
                v-for="tag in Mylog.tagsAll.filter(tag =>
                  tag.logtime.isSame(dayjs(data.date), 'day')
                )"
                :key="tag.content"
                closable
                @close="tabNoteClose(tag)"
                style="max-width: 100%"
              >
                {{ tag.content }}
              </ElTag>
            </div>
          </div>
        </template>
      </ElCalendar>
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar-comp {
  .tags-top {
    cursor: pointer;
  }

  .calendar-main {
    border-radius: var(--border-radius);
    padding: var(--padding);

    /* 覆盖El的样式 */
    --el-fill-color-blank: transparent;

    .cell-tags {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    :deep(.el-calendar) {
      /* 整个日历表格的内边距 */
      .el-calendar__body {
        padding: 0px;

        .el-calendar-table__row {
          height: 100px !important;

          /* 日历格子的内边距 */
          .el-calendar-day {
            padding: 1px;
            height: 100%;
          }
        }
      }

      // .el-tag {
      //   padding: 0px 4px;
      // }

      // /* 日历格子里标签文本的样式 */
      // .el-tag__content {
      //   padding: 1px;
      //   /* 超出省略号（单行） */
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   /* white-space: nowrap; */
      // }

      /* .el-calendar ::v-deep(.el-calendar-table) {
      min-height: 1000px;
    } */
    }
  }
}
</style>
