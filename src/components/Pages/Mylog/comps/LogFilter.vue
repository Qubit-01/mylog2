<script setup lang="ts">
import useLogStore from '@/stores/log'
import type { Log, LogFilter } from '@/types'
import dayjs from 'dayjs'

const mylog = useLogStore().mylog

const curFilter = ref(-1) // -1是全部，-2是自定义筛选
const diyFilter = reactive<LogFilter>({
  type: '',
  timeLimit: [null, null],
  isOrAll: true,
  content: { include: [], isOr: false },
  people: { include: [], isOr: false },
  tags: { include: [], isOr: false },
  exclude: [], // 不包括，填入noteI
})
// 这段数据应该从后端获取的
// 因为用户筛选项应该有先后顺序，所以用数组
const filters: LogFilter[] = [
  {
    name: '公开',
    type: 'public',
    timeLimit: [null, null],
    isOrAll: true,
    content: { include: [], isOr: false },
    people: { include: [], isOr: false },
    tags: { include: [], isOr: false },
    exclude: [],
  },
  {
    name: '洗衣服',
    type: '',
    timeLimit: [null, null],
    isOrAll: true,
    content: { include: ['洗'], isOr: false },
    people: { include: [], isOr: false },
    tags: { include: [], isOr: false },
    exclude: [],
  },
  {
    name: '排除3970',
    type: '',
    timeLimit: [null, null],
    isOrAll: true,
    content: { include: ['洗'], isOr: false },
    people: { include: [], isOr: false },
    tags: { include: [], isOr: false },
    exclude: ['3970'],
  },
]

// const diyFilter = props.screen

watch([curFilter, diyFilter], () => {
  if (curFilter.value === -1) mylog.setFilter(undefined)
  else if (curFilter.value === -2) mylog.setFilter(diyFilter)
  else mylog.setFilter(filters[curFilter.value])
})

// watch(filter.timeLimit, () => {
//     // 判断时间先后
//     if (
//       filter.timeLimit[0] &&
//       filter.timeLimit[1] &&
//       dayjs(filter.timeLimit[0]).diff(dayjs(filter.timeLimit[1])) > 0
//     ) {
//       delete filter.timeLimit[1]
//       ElMessage('结束时间必须在开始时间之后哦！')
//     }
//   })
</script>

<template>
  <div class="log-filter">
    <ElRadioGroup v-model="curFilter" size="small">
      <!-- size="large" -->
      <ElRadioButton label="全部" :value="-1" />
      <ElRadioButton v-for="(f, i) in filters" :label="f.name" :value="i" />
      <ElRadioButton label="筛选" :value="-2" />
    </ElRadioGroup>
    {{ diyFilter }}
    <div v-if="curFilter === -2" class="diy-filter" v-m>
      <ElRow>
        记录类型：
        <ElRadioGroup size="small" v-model="diyFilter.type">
          <ElRadioButton label="全部" value="" />
          <ElRadioButton label="隐私" value="log" />
          <ElRadioButton label="公开" value="public" />
        </ElRadioGroup>
      </ElRow>
      <ElRow>
        时间限制：
        <ElDatePicker
          v-model="diyFilter.timeLimit[0]"
          type="date"
          placeholder="起始日期"
          size="small"
          :editable="false"
          style="width: 120px"
        />
        &nbsp;~&nbsp;
        <ElDatePicker
          v-model="diyFilter.timeLimit[1]"
          type="date"
          placeholder="结束日期"
          size="small"
          :editable="false"
          style="width: 120px"
        />
      </ElRow>

      <ElRow>
        <EditTags v-model="diyFilter.content.include" label="内容含有：">
          <ElSwitch
            v-model="diyFilter.content.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <EditTags v-model="diyFilter.people.include" label="人员含有：">
          <ElSwitch
            v-model="diyFilter.people.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <EditTags v-model="diyFilter.tags.include" label="标签含有：">
          <ElSwitch
            v-model="diyFilter.tags.isOr"
            size="small"
            inline-prompt
            active-text="或"
            inactive-text="和"
          />
        </EditTags>
      </ElRow>
      <ElRow>
        <ElSwitch
          v-model="diyFilter.isOrAll"
          size="small"
          active-text="内容、人员、标签做或运算"
        />
      </ElRow>
      <ElRow v-if="diyFilter.exclude.length">
        排除 ID ：
        <ElTag
          v-for="tag in diyFilter.exclude"
          :key="tag"
          closable
          @close="diyFilter.exclude.splice(diyFilter.exclude.indexOf(tag), 1)"
          style="margin-right: 5px; margin-bottom: 5px"
        >
          {{ tag }}</ElTag
        >
      </ElRow>
    </div>
  </div>
</template>

<style scoped lang="less">
.log-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .diy-filter {
    padding: var(--padding);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
