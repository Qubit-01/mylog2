<!-- 
    切换显示和编辑状态的输入框
 -->
<script setup lang="ts">
const value = defineModel<string>({ required: true })

const isEdit = ref(false)
const InputDom = ref<HTMLInputElement>()

const showEdit = () => {
  isEdit.value = true
  nextTick(() => {
    InputDom.value?.focus()
  })
}
</script>

<template>
  <span v-if="!isEdit" @click="showEdit">{{ value }}</span>
  <ElInput
    v-else
    ref="InputDom"
    v-model="value"
    @blur="isEdit = false"
    @keyup.enter="isEdit = false"
  />
</template>

<style scoped lang="less"></style>
