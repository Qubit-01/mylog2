<!-- 
	代办Todo的单独组件
	日历的标签不用实现，直接用tag
 -->

<script setup lang="ts">
import type { Log } from '@/types'
import { CaretTop, StarFilled } from '@element-plus/icons-vue'
import type { CheckboxValueType } from 'element-plus'
import { vOverflowEllipsis, vDblclick } from '@/utils/directives'

const { log } = defineProps<{ log: Log }>()
provide('log', log) // 暴露给子组件

// 双击log，展开和收起
const isExpand = ref(false)
const expand = () => {
  isExpand.value = !isExpand.value
}
</script>

<template>
  <div class="log-todo" v-m v-dblclick="expand">
    <div class="left">
      <ElCheckbox
        v-model="log.info.todo!.complete"
        size="large"
        style="height: 14px"
      />
    </div>
    <div v-if="log.info.todo?.complete" class="completed">
      {{ log.content }}
    </div>
    <div v-else>
      {{ log.content }}
    </div>

    <ElButtonGroup class="buttons">
      <!-- 增加优先级 -->
      <ElButton :icon="CaretTop" />
      <!-- 降低优先级 -->
      <ElButton :icon="CaretTop" />
      <!-- 完成 -->
      <ElButton :icon="StarFilled" />
    </ElButtonGroup>
  </div>
</template>

<style scoped lang="less">
.log-todo {
  border-radius: var(--border-radius);
  padding: var(--padding);

  display: flex;
  align-items: center;
  gap: 4px;
  // flex-direction: column;

  // 已完成
  .completed {
    text-decoration: line-through;
  }

  .buttons {
    display: none;
    position: absolute;
    top: -26px;
    right: var(--padding);
  }

  &:hover .buttons {
    display: block;
  }
}
</style>
