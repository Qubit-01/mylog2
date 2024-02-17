<script setup lang="ts">
import type { Log } from '@/types'

const { logEdit } = defineProps<{ logEdit: Log }>()

const release = () => {
  console.log('发布', logEdit)
}
</script>

<template>
    <div class="log-release" v-m>
        <!-- {{ editNote }} -->
        <ElInput v-model="logEdit.content" :autosize="{ minRows: 3 }" type="textarea" placeholder="记录内容" />

        <ElButton type="primary" @click="release">发布</ElButton>
    </div>
</template>

<style scoped lang="less">
.log-release {
    padding: var(--padding);
    border-radius: var(--border-radius);
    
}
</style>