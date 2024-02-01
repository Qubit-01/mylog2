<script setup lang="ts">
import axios from 'axios'
import type { User } from '@/types'


const login = reactive({
  name: 'Sybit',
  pswd: '12345qaZ',
})

const doLogin = async () => {
  const { data: user }: { data: User } = await axios.post("user/login_pswd", login)
  console.log(user)
  if (user) {
    console.log("存储用户信息跳转")
  } else {
    console.log("错误")
  }
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