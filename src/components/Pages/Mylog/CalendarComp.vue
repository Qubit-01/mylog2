<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
// import { useSetting } from '@/stores/setting'
// import { useNote } from '@/stores/note'
import useUserStore from '@/stores/user'

const Setting = useUserStore().setting

// { "isSelected": true, "type": "current-month", "day": "2022-10-26", "date": "2022-10-26T01:21:04.150Z" }
const valueCalendar = ref<Date>(new Date()) // 日历选中的日期

// 日历每一项要获取对应的tags，每一项要输入自己的天数
// const getTagsByDate = computed(() => (date) => {
//   return Note.tags.filter((tag) => {
//     return dayjs(tag.noteTime).format("YYYYMMDD") == dayjs(date).format("YYYYMMDD");
//   })
// })

// 给选中日期绑定对应tag
// const clickTag = (tagContent) => {
//   let noteJson = JSON.stringify({
//     noteTime: dayjs(valueCalendar.value).format("YYYY-MM-DD HH:mm:ss"),
//     noteContent: tagContent, noteType: 'tag'
//   })
//   myPost("/note/release", { noteJson, userToken: User.token }, note => {
//     // 这个接口返回插入数据的id
//     console.log(note.noteId, "发送一条tagNote成功")
//     Note.tags.push({
//       noteContent: tagContent, noteId: note.noteId, noteTime: valueCalendar.value, noteType: "tag",
//     })
//   })
// }

// 点击日历格子里的标签关闭
// const tabNoteClose = (tag) => {
//   myPost("/note/delete", { noteId: tag.noteId, userToken: User.token }, (data) => {
//     console.log(data, "删除一条tagNote成功");
//     Note.tags.splice(Note.tags.indexOf(tag), 1);
//   })
// }
</script>

<template>
  <div class="calendar-comp">
    <!-- {{ Note.tags }} -->
    <!-- {{dayjs(valueCalendar).format("YYYY-MM-DD HH:mm:ss")}} -->
    <div>
      <!-- 建立标签 -->
      <!-- <ElTag
        v-for="tag in Setting.noteSetting.calendarTags"
        :key="tag"
        size="large"
        @click="clickTag(tag)"
        class="tags-top"
      >
        {{ tag }}
      </ElTag> -->
    </div>

    <div class="calendar-main" v-m>
      <!-- 日历 -->
      <ElCalendar v-model="valueCalendar">
        <!-- 单元格 -->
        <template #date-cell="{ data }">
          <div>
            {{ dayjs(data.date).format('D') }}<br />
            <div>
              <!-- <ElTag
                v-for="tag in getTagsByDate(data.date)"
                :key="tag"
                closable
                @close="tabNoteClose(tag)"
                style="max-width: 100%"
              >
                {{ tag.noteContent }}
              </ElTag> -->
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
