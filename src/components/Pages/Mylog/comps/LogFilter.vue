<script setup lang="ts">
import type { Log } from '@/types'
import dayjs from 'dayjs'

const curFilter = ref(-1) // -1是全部，-2是自定义筛选
// 这段数据应该从后端获取的
// 因为用户筛选项应该有先后顺序，所以用数组
const filters = [
  {
    name: '与时间无关的',
  },
  {
    name: '文学',
  },
  {
    name: '健身',
  },
]

// const diyFilter = props.screen

interface LogFilter {
  /**
   * 时间限制，范围
   */
  timeLimit: [any, any]
  /**
   *
   */
  isOrAll: boolean
  contentInclude: string[]
  isOrContent: boolean
  peopleInclude: []
  isOrPeople: boolean
  tagsInclude: string[]
  isOrTags: boolean
  exclude: string[] // 不包括，填入noteI
  type: '' | 'log' | 'public'
}

const diyFilter = reactive<LogFilter>({
  timeLimit: [null, null],
  isOrAll: true,
  contentInclude: [],
  isOrContent: false,
  peopleInclude: [],
  isOrPeople: false,
  tagsInclude: [],
  isOrTags: false,
  exclude: [], // 不包括，填入noteI
  type: '',
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

/**
 * 传入一个log，返回布尔值
 * @param log Log对象
 * @param filter 过滤器对象
 */
const filteLog = (log: Log, filter: any) => {
  // 记录状态
  if (filter.noteType != 'all' && log.type != filter.type) return false

  // 时间限制，包含两头
  if (
    filter.timeLimit[0] &&
    dayjs(log.logtime).diff(dayjs(filter.timeLimit[0])) < 0
  )
    return false
  if (
    filter.timeLimit[1] &&
    dayjs(log.logtime).diff(dayjs(filter.timeLimit[1])) > 86400000
  )
    return false

  // 排除
  if (filter.exclude.indexOf(log.id) != -1) return false

  // 判断arr是否含有includeArr, isOr为true则全部都要有
  let include = (arr, includeArr, isOr) => {
    if (!arr || !arr.length) return false

    for (const value of includeArr) {
      if (arr.indexOf(value) != -1) {
        // 有
        if (isOr) return true // 或
        else continue // 与
      } else {
        // 无
        if (!isOr) return false // 与
        else continue // 或
      }
    }
    return !isOr
  }

  if (filter.contentInclude.length) {
    if (include(log.content, filter.contentInclude, filter.isOrContent)) {
      // 有
      if (filter.isOrAll) return true // 或
    } else {
      // 无
      if (!filter.isOrAll) return false // 与
    }
  }
  if (filter.peopleInclude.length) {
    if (include(log.people, filter.peopleInclude, filter.isOrPeople)) {
      // 有
      if (filter.isOrAll) return true // 或
    } else {
      // 无
      if (!filter.isOrAll) return false // 与
    }
  }
  if (filter.tagsInclude.length) {
    if (include(log.tags, filter.tagsInclude, filter.isOrTags)) {
      // 有
      if (filter.isOrAll) return true // 或
    } else {
      // 无
      if (!filter.isOrAll) return false // 与
    }
  }

  return !filter.isOrAll
}
</script>

<template>
  <!-- {{ curFilter }} -->
  <div class="log-filter">
    <ElRadioGroup v-model="curFilter" size="small">
      <!-- size="large" -->
      <ElRadioButton label="全部" :value="-1" />
      <ElRadioButton v-for="(f, i) in filters" :label="f.name" :value="i" />
      <ElRadioButton label="筛选" :value="-2" />
    </ElRadioGroup>

    <div v-if="curFilter === -2" class="diy-filter" v-m>
      <ElRow>
        记录状态：
        <ElRadioGroup size="small" v-model="diyFilter.type">
          <ElRadioButton label="all">全部</ElRadioButton>
          <ElRadioButton label="log">隐私</ElRadioButton>
          <ElRadioButton label="public">公开</ElRadioButton>
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
        <TagsComp :tags="diyFilter.contentInclude" label="内容含有">
          <ElSwitch
            v-model="diyFilter.isOrContent"
            size="small"
            active-text="或运算"
            style="margin-right: 10px"
          />
        </TagsComp>
      </ElRow>
      <ElRow>
        <TagsComp :tags="diyFilter.peopleInclude" label="人员含有">
          <ElSwitch
            v-model="diyFilter.isOrPeople"
            size="small"
            active-text="或运算"
            style="margin-right: 10px"
          />
        </TagsComp>
      </ElRow>
      <ElRow>
        <TagsComp :tags="diyFilter.tagsInclude" label="标签含有">
          <ElSwitch
            v-model="diyFilter.isOrTags"
            size="small"
            active-text="或运算"
            style="margin-right: 10px"
          />
        </TagsComp>
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
    display: flex;
    flex-direction: column;
    gap: 8px
  }
}
</style>
