<script setup>
// import { nextTick } from 'vue'
const props = defineProps(['tags', 'label'])

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)

// 点击删除按钮
const handleClose = (tag) => {
  props.tags.splice(props.tags.indexOf(tag), 1)
}

// 单击添加标签
const showInput = () => {
  inputVisible.value = true
  nextTick(() => { InputRef.value.input.focus() })
}

// 输入框回车或者失去焦点
const handleInputConfirm = () => {
  inputVisible.value = false
  if (inputValue.value) props.tags.push(inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <ElRow>
    <span v-if="label">{{ label }}：</span>
    <slot></slot>
    <ElTag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)"
      style="margin-right:5px;margin-bottom:5px">{{ tag }}</ElTag>

    <ElInput v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm" style="width:90px;margin-bottom:5px" maxlength="20" />
    <el-button v-else @click="showInput" size="small" style="width:90px;margin-bottom:5px">+ New</el-button>

  </ElRow>
</template>

<style scoped></style>