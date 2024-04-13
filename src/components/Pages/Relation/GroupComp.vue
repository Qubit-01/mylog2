<script setup lang="ts">
const { group } = defineProps<{ group: string }>()
const curTab = ref('new')
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
          添加人员
          <!-- <NewPeople :groups="groups" :handleRaws="handleRaws" /> -->
        </ElTabPane>

        <ElTabPane label="添加组员" name="group">
          添加组员
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
}
</style>
