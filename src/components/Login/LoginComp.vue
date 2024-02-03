<script setup lang="ts">
import type { User } from '@/types'
import { loginPswd } from '@/api/user'


const login = reactive({
  name: 'Sybit',
  pswd: '12345qaZ',
})

const doLogin = async () => {

  let user: User | null = null

  try {
    user = (await loginPswd(login.name, login.pswd)).data
  } catch (e) {
    console.log('请求失败', e)
  }

  console.log(user)
}

</script>

<template>
  <div class="login-comp" v-m>
    <div>多元记</div>
    <ElInput v-model="login.name" placeholder="用户名" />
    <ElInput v-model="login.pswd" placeholder="密码" />
    <ElButton @click="doLogin">登录</ElButton>
    <RouterLink to="/login/signin" replace>去注册</RouterLink>
  </div>
</template>

<style scoped lang="less">
.login-comp {
  padding: 10px;
  border-radius: 10px;
}
</style>