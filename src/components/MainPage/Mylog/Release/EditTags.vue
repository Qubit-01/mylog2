<script setup lang="ts">

const tags = defineModel<string[]>({ required: true })

const del = (tag: string) => {
  // tags.value = tags.value.filter((item) => item !== tag)
  tags.value.splice(tags.value.indexOf(tag), 1)

}


// 编辑
const inputVisible = ref(false)
const inputValue = ref('')
const inputDom = ref<HTMLInputElement>()
// 单击添加标签
const showInput = () => {
  inputVisible.value = true
  nextTick(() => { inputDom.value!.focus() })
}
// 输入框回车或者失去焦点
const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<template>
  <div class="edit-tags">
    <ElTag v-for="tag in tags" :key="tag" closable @close="del(tag)">
      {{ tag }}
    </ElTag>


    <ElInput v-if="inputVisible" ref="inputDom" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm" style="width:90px;margin-right:5px;margin-bottom:5px" maxlength="20" />
    <ElButton v-else size="small" @click="showInput" style="width:90px;margin-right:5px;margin-bottom:5px">
      + New Tag
    </ElButton>
  </div>
</template>

<style scoped lang="less">
.edit-tags {
  display: flex;
  gap: 4px;
}
</style>