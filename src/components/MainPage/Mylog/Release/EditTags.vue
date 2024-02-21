<script setup lang="ts">

const tags = defineModel<string[]>({ 
  required: true,
})

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
const inputConfirm = () => {
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

    <ElInput v-if="inputVisible" ref="inputDom" v-model="inputValue" maxlength="20" size="small"
      @keyup.enter="inputConfirm" @blur="inputConfirm" style="width:90px;" />
    <ElButton v-else size="small" @click="showInput" style="width:90px;">
      + New Tag
    </ElButton>
  </div>
</template>

<style scoped lang="less">
.edit-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>