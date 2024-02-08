<script setup lang="ts">
import type { User } from '@/types'
import { loginPswd } from '@/api/user'
import useGlobalStore from '@/stores/global'
import { deepMerge } from '@/utils'

const Global = useGlobalStore()
const User = Global.user
const router = useRouter()

const login = reactive({
  name: 'Sybit',
  pswd: '12345qaZ',
})

const doLogin = async () => {
  let user: User | null = null
  user = await loginPswd(login)
  deepMerge(User, user)
  localStorage.setItem('token', user.token!)
  router.push('/').then(a=>{
    console.log('🐔[LoginComp.vue-:22] ', a)
  })
}

const logout = () => {
  Global.logout()
  router.go(0) // 刷新页面
}

</script>

<template>
  <div class="login-comp" v-m>

    <div class="banner">
      <div class="text">
        <div>欢迎来到</div>
        <div class="title">多元记</div>
        <div> </div>
        <div>把你写成书 ~</div>

      </div>
      <div class="theme-switch">
        <ThemeSwitch />
      </div>
    </div>

    <div class="main">
      <div class="title">登录</div>

      <div v-if="Global.isLogined" class="loged">
        <div>我们检测到您已经登录了，是否要</div>
        <ElButton @click="logout">重新登录</ElButton>
      </div>

      <div v-else class="login">

        <div>
          <input v-model="login.name" placeholder="用户名" />
          <input v-model="login.pswd" placeholder="密码" />
          <ElButton @click="doLogin">登录</ElButton>
          <div class="toSignin">
            没有账号？
            <RouterLink to="/login/signin" replace>去注册</RouterLink>
          </div>
        </div>

        <div>
          <div class="three">
            <div></div>
            <span>第三方登录</span>
            <div></div>
          </div>
          <div class="icons">
            <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/wechat.png" alt="QQ登录">
            <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/weibo.png" alt="QQ登录">
            <img src="https://s1.hdslb.com/bfs/static/jinkela/passport-pc/assets/qq.png" alt="QQ登录">
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.login-comp {
  border-radius: 24px;
  width: 70vw;
  min-width: 300px;
  max-width: 1000px;
  height: 50vh;
  min-height: 400px;
  display: flex;

  .banner {
    flex: 1;
    // width: 400px;
    max-width: 600px;
    border-radius: 24px;
    background-image: url('https://api.lyiqk.cn/scenery');
    background-position: center center;
    background-size: cover;
    position: relative;
    box-shadow: 0 0 4px 4px #0003;

    .text {
      border-radius: 20px;
      padding: 24px;
      border: 1px solid var(--m-border);
      background-color: var(--m-background-color);
      backdrop-filter: blur(10px);
      margin-top: 40px;
      margin-left: 40px;
      margin-right: 40px;

      .title {
        font-size: 2.5em;
        font-weight: bold;
        color: var(--m-text-color);
      }
    }

    .theme-switch {
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
  }

  .main {
    padding: 40px;
    width: 400px;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .loged {
      margin-bottom: 20px;

      >div:nth-child(1) {
        margin-bottom: 24px;
      }
    }

    .login {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      >div:nth-child(1) {
        display: flex;
        flex-direction: column;
        gap: 24px;

        input {
          background-color: #8882;
          font-size: 1.2rem;
          padding: 12px;
          border-radius: 6px;
          border: none;
          outline: none;
          transition: all 0.5s;

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
        gap: 24px;

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
  }

  @media (max-width: 1024px) {

    & {
      width: inherit;
    }

    .banner {
      display: none;
    }
  }
}
</style>