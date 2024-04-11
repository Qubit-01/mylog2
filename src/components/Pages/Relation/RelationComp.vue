<script setup lang="ts">
import type { Relation } from '@/types'
import { vImgSrc } from '@/utils/directives'
import { Check, Delete } from '@element-plus/icons-vue'

const { relation } = defineProps<{ relation: Relation }>()
const curTab = ref('info')

const infoOther = reactive({
  key: '',
  value: '',
})
const addInfoOther = () => {
  relation.info._other[infoOther.key] = infoOther.value
  infoOther.key = ''
  infoOther.value = ''
}
</script>

<template>
  {{ relation }}
  <div class="relation-comp" v-m>
    <div class="relation">
      <div class="node">
        <div class="img">
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
        <ElButton type="primary" size="small">删除节点</ElButton>
      </div>
      <div class="info">
        <ElTabs v-model="curTab">
          <ElTabPane label="人员信息" name="info">
            {{ relation }}
            <ElForm label-width="auto" @submit.native.prevent>
              <ElFormItem label="姓名">
                <InputSwitch v-model="relation.name" />
              </ElFormItem>
              <ElFormItem label="所属节点">
                <InputSwitch v-model="relation.from" />
              </ElFormItem>
              <ElFormItem label="和所属关系">
                <InputSwitch v-model="relation.info.label" />
              </ElFormItem>
              <ElFormItem label="电话号码">
                <InputSwitch v-model="relation.info.phone" />
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
                <ElInput v-model="infoOther.value" placeholder="内容" />
                <ElButton
                  type="success"
                  :icon="Check"
                  text
                  circle
                  @click="addInfoOther"
                />
              </ElFormItem>
            </ElForm>
          </ElTabPane>
          <ElTabPane label="添加人员" name="new">
            添加人员
            <!-- <NewPeople :groups="groups" :handleRaws="handleRaws" /> -->
          </ElTabPane>

          <el-tab-pane label="添加组员" name="group">
            <!-- <el-form @submit.prevent :model="newPeopleForm" label-width="70px">
              <el-form-item label="添加到">
                {{ selectedPeople.label }}
              </el-form-item>
              <el-form-item label="姓名">
                <ElInput v-model="newPeopleForm.rName" />
              </el-form-item>
              <el-form-item label="电话">
                <ElInput v-model="newPeopleForm.rNumber" />
              </el-form-item>
              <el-form-item label="线条标签">
                <ElInput v-model="newPeopleForm.rEdgeLabel" />
              </el-form-item>
              <el-form-item
                label="解释"
                v-show="newPeopleForm.rName"
                style="color: #999"
              >
                <span>
                  我的 {{ selectedPeople.label }} 是 {{ newPeopleForm.rName }}
                </span>
                <span v-show="newPeopleForm.rEdgeLabel"
                  >，他是我的 {{ newPeopleForm.rEdgeLabel }}</span
                >
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="newPeople">提交</el-button>
              </el-form-item>
            </el-form> -->
          </el-tab-pane>

          <el-tab-pane label="其后添加" name="add">
            <!-- <el-form @submit.prevent :model="newPeopleForm" label-width="70px">
              <el-form-item label="添加到">
                {{ selectedPeople.label }}
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="newPeopleForm.rName" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="newPeopleForm.rNumber" />
              </el-form-item>
              <el-form-item label="线条标签">
                <el-input v-model="newPeopleForm.rEdgeLabel" />
              </el-form-item>
              <el-form-item
                label="解释"
                v-show="newPeopleForm.rName"
                style="color: #999"
              >
                <span v-show="!newPeopleForm.rEdgeLabel"
                  >{{ newPeopleForm.rName }} 和
                  {{ selectedPeople.label }} 有关</span
                >
                <span v-show="newPeopleForm.rEdgeLabel">
                  {{ selectedPeople.label }} 的
                  {{ newPeopleForm.rEdgeLabel }} 是 {{ newPeopleForm.rName }}
                </span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="newPeople">提交</el-button>
              </el-form-item>
            </el-form> -->
          </el-tab-pane>
        </ElTabs>
      </div>
    </div>

    <slot name="bottom"></slot>
  </div>
</template>

<style scoped lang="less">
.relation-comp {
  padding: var(--padding);
  border-radius: var(--border-radius);

  display: flex;
  flex-direction: column;
  gap: 4px;

  // 空div应该不占用gap
  > div:empty {
    display: none;
  }

  .relation {
    display: flex;
    flex-direction: column;
    // gap: var(--padding);

    .node {
      min-width: 90px;
      // border-right: 1px solid #aaa;
      display: flex;
      // flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      gap: 8px;

      .img {
        // margin-top: 8px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .info {
      // border: 1px solid red;
      flex: 1;
      width: 100%;

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
}
</style>
