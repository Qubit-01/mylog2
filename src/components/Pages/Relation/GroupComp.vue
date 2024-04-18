<script setup lang="ts">
import type { Relation } from '@/types'
import { Check, Delete } from '@element-plus/icons-vue'

const { group } = defineProps<{ group: string }>()
const curTab = ref('new')

const relation = reactive<Relation>({
  id: '',
  userid: '1',
  username: 'Sybit',
  from: group,
  name: '',
  info: {
    _other: {},
  },
})

const infoOther = reactive({
  key: '',
  value: '',
})

const addInfoOther = () => {
  if (infoOther.key && infoOther.value) {
    relation.info._other[infoOther.key] = infoOther.value
    infoOther.key = ''
    infoOther.value = ''
  }
}
</script>

<template>
  <div class="group-comp" v-m>
    <div class="node">
      {{ group }}
      <!-- <div class="img">
        <img
          v-img-src="
            relation.info.img ||
            'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          "
          alt="节点头像"
        />
      </div>
      <div>ID: {{ relation.id }}</div>
      <div>{{ relation.name }}</div>
      <div>{{ relation.from }}</div>
      <ElButton type="primary" size="small">删除节点</ElButton> -->
    </div>

    <div class="info">
      <ElTabs v-model="curTab">
        <ElTabPane label="添加人员" name="new">
          {{ relation }}
          <ElForm label-width="auto" @submit.native.prevent>
            <ElFormItem label="姓名">
              <ElInput v-model="relation.name" />
            </ElFormItem>
            <ElFormItem label="所属节点">
              <ElInput v-model="relation.from" />
            </ElFormItem>
            <ElFormItem label="和所属关系">
              <ElInput v-model="relation.info.label" />
            </ElFormItem>
            <ElFormItem label="电话号码">
              <ElInput v-model="relation.info.phone" />
            </ElFormItem>

            <ElFormItem label="更多信息项" />
            <ElFormItem
              v-for="(value, key) in relation.info._other"
              :label="key"
              :key="key"
              class="column"
            >
              <InputSwitch v-model="relation.info._other[key]" />
              <ElButton
                type="danger"
                :icon="Delete"
                text
                circle
                @click="delete relation.info._other[key]"
              />
            </ElFormItem>
            <ElFormItem class="column">
              <template #label>
                <ElInput
                  v-model="infoOther.key"
                  placeholder="项名称"
                  style="width: 80px"
                />
              </template>
              <ElInput
                v-model="infoOther.value"
                placeholder="内容"
                @keyup.enter="addInfoOther"
              />
              <ElButton
                type="success"
                :icon="Check"
                text
                circle
                @click="addInfoOther"
              />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary">保存</ElButton>
            </ElFormItem>
          </ElForm>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.group-comp {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 4px;

  .info {
    // border: 1px solid red;
    flex: 1;
    width: 100%;

    :deep(.el-tabs__content) {
      height: 200px;
      overflow: auto;
      .el-form-item {
        margin-bottom: 8px;
      }
    }

    .column {
      :deep(.el-form-item__content) {
        // display: flex;
        gap: 8px;
        // align-items: center;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
