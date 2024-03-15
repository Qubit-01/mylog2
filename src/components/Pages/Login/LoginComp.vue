<script setup lang="ts">
import type { User } from '@/types'
import { loginPswd } from '@/api/user'
import useGlobalStore from '@/stores/global'
import { deepMerge } from '@/utils'

const Global = useGlobalStore()
const User = Global.user
const router = useRouter()

const login = reactive({
  name: '',
  pswd: '',
})

const doLogin = async () => {
  let user: User
  user = await loginPswd(login)
  if (user) {
    ElMessage.success(`欢迎你，${user.name} ！`)
    router.push('/').then(a => {
      deepMerge(User, user!)
      localStorage.setItem('token', user!.token!)
    })
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<template>
  <StructLogin>
    <div class="title">登录</div>

    <div class="login">

      <form>
        <input v-model="login.name" placeholder="用户名" type="text" autocomplete="on" />
        <input v-model="login.pswd" placeholder="密码" type="password" autocomplete="on" />
        <ElButton @click="doLogin">登录</ElButton>
        <div class="toSignin">
          没有账号？
          <RouterLink to="/login/signin" replace>去注册</RouterLink>
        </div>
      </form>

      <div>
        <div class="three">
          <div></div>
          <span>第三方</span>
          <div></div>
        </div>
        <div class="icons">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/wechat.png" alt="QQ登录">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/weibo.png" alt="QQ登录">
          <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/qq.png" alt="QQ登录">
        </div>
      </div>

    </div>
  </StructLogin>
</template>

<style scoped lang="less">
.title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}


.login {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  >form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    input {
      color: var(--color-text);
      background-color: #8882;
      font-size: 1.2rem;
      padding: 12px;
      border-radius: 6px;
      border: none;
      outline: none;
      transition: all 0.5s;

      /* 去除自动浏览器自动填充添加的样式 */
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-transition-delay: 99999s;
        -webkit-transition:
          color 99999s ease-out,
          background-color 99999s ease-out;
      }

      &:focus,
      &:hover {
        box-shadow: 1px 1px 2px 2px #0001;
      }
    }

    .toSignin {
      text-align: right;
    }
  }

  // 选中最后一个div
  >div:last-child {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .three {
      display: flex;
      align-items: center;
      opacity: 0.6;

      >span {
        margin: 0 20px;
      }

      >div {
        display: inline-block;
        height: 0;
        flex: 1;
        border-top: var(--m-border);
      }
    }

    .icons {
      display: flex;
      justify-content: space-evenly;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
</style>