<!-- 
  正常流程：这个页面是通过QQ登录后重定向而来，会自动给站点注入QQ登录状态的数据
  先加载，看有没有对应的用户
  1. 有，直接登录，获取token
  2. 没有，分两种情况，让用户选择
   ① 有本网站账号，启动绑定流程
    让用户输入账号密码
   ② 不是网站用户，启动注册流程
    让用户注册

  https://mylog.cool/#/login/qq-redirect
  #access_token=C8CB48CFEF31E123EA660E14218B493E
  &expires_in=7776000
  &state=login
 -->
<script setup lang="ts">
import QC from '@/utils/qq-connect'
import { haveUser, login, signin, updateUser } from '@/api/user'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { baseURL } from '@/stores/constant'

const route = useRoute()
const state = ref(0) // 0加载 1选择（没找到用户） 2登录 3注册
const loginData = reactive({ name: '', pswd: '', captcha: '' })
// 确认密码独立出来
const pswd2 = ref('')
const qqImg = ref(true)
const user = reactive<{
  data: any
  openidQ: string
  accessToken: string
}>({
  data: {},
  openidQ: '',
  accessToken: '',
})

const captchaDom = ref<HTMLImageElement>()

if (QC.Login.check()) {
  QC.api('get_user_info').success((res: any) => {
    user.data = res.data
  })
  // 如果是登录状态
  QC.Login.getMe(async (openidQ, accessToken) => {
    user.openidQ = openidQ
    user.accessToken = accessToken
    // 先看数据库有没有这个openId
    const count = await haveUser({ openidQ })
    if (count === 0) state.value = 1
    else {
      console.log('🐤找到账号直接登录')
      login({ openidQ }).then(user => {
        localStorage.setItem('token', user.token!)
        // location.replace('/#' + (route.query.redirect || ''))
        location.href = '/'
      })
    }
  })
} else {
  // 用户没有QQ登录直接进入此页面
  location.replace('/#/login')
}

// 1.绑定已有账号
const bd = () => {
  // 先登录获取token，再token和openid一起绑定
  login({
    name: loginData.name,
    pswd: loginData.pswd,
  }).then(resUser => {
    if (resUser.token) {
      console.log('🐤', user.data)
      const userJson: any = { openidQ: user.openidQ }
      if (qqImg.value) userJson.img = user.data.figureurl_qq

      updateUser({
        token: resUser.token,
        userJson: JSON.stringify(userJson),
      }).then(count => {
        if (count === 1) {
          ElMessage({ message: '绑定成功', type: 'success' })
          localStorage.setItem('token', resUser.token!)
          location.replace('/')
        } else {
          return ElMessage({ message: '绑定失败', type: 'error' })
        }
      })
    } else {
      return ElMessage.error('用户名或密码不正确')
    }
  })
}

// 2.用户选择注册新用户
// 获取QQ名作为默认名字，叫他设置用户名（万一被占用了）和密码
const handleNew = () => {
  state.value = 3
  loginData.name = user.data.nickname
  haveUser({ name: loginData.name }).then(count => {
    if (count) ElMessage.error('该用户名被占用了哦')
  })
  nextTick(changeImg)
}
// 点击注册
const zc = async () => {
  // 普通校验
  if (loginData.pswd.trim() != pswd2.value.trim())
    return ElMessage.error('两次密码不一致')
  const userid = await signin(loginData)
  console.log(userid)
  if (userid === 0) return ElMessage.error('用户名已存在')
  if (userid === -1) return ElMessage.error('验证码错误')

  // 先登录获取token，再token和openid一起绑定
  login({
    name: loginData.name,
    pswd: loginData.pswd,
  }).then(resUser => {
    // const token = resUser.token
    console.log('🐤绑定')
    if (resUser.token) {
      const userJson: any = {
        img: user.data.figureurl_qq, // 头像
        openidQ: user.openidQ,
      }
      updateUser({
        token: resUser.token,
        userJson: JSON.stringify(userJson),
      }).then(count => {
        if (count === 1) {
          ElMessage({ message: '绑定成功', type: 'success' })
          localStorage.setItem('token', resUser.token!)
          location.replace('/')
        } else {
          ElMessage({ message: '绑定失败', type: 'error' })
        }
      })
    } else {
      ElMessage.error('用户名或密码不正确')
      return false
    }
  })
}

//刷新验证码
const changeImg = () => {
  captchaDom.value!.src = baseURL + '/user/signin/captcha_img?' + Math.random()
}
</script>

<template>
  <StructLogin>
    <!-- {{ user }} -->
    <div class="title">
      <div class="left">
        <ElButton
          v-if="state > 1"
          :icon="ArrowLeftBold"
          @click="state = 1"
          text
          circle
        />QQ登录
      </div>

      <div class="right">
        <div>{{ user.data.nickname }}</div>
        <img :src="user.data.figureurl_qq" />
      </div>
    </div>

    <div
      class="qq-redirect"
      v-loading="state === 0"
      element-loading-background="transparent"
    >
      <form v-if="state === 1">
        <div class="title2">没有找到对应的用户</div>
        <div>以前有注册过本网站吗？有的话直接给您绑定</div>
        <ElButton @click="state = 2" size="large">绑定已有账号</ElButton>
        <ElButton @click="handleNew" size="large">注册新用户</ElButton>
      </form>

      <!-- 绑定已有 -->
      <form v-if="state == 2">
        <div class="title2">绑定已有账号</div>
        <input
          type="text"
          class="username"
          v-model="loginData.name"
          autocomplete="off"
          placeholder="用户名"
        />
        <input
          type="password"
          class="password"
          v-model="loginData.pswd"
          autocomplete="off"
          placeholder="密码"
        />
        <ElSwitch v-model="qqImg" active-text="使用QQ头像" />
        <ElButton
          @click="bd"
          size="large"
          :disabled="!loginData.name.trim() || !loginData.pswd.trim()"
          >绑定并登录</ElButton
        >
      </form>

      <!-- 注册新用户 -->
      <form v-if="state == 3">
        <div class="title2">注册新用户</div>
        <input
          type="text"
          v-model="loginData.name"
          autocomplete="off"
          placeholder="用户名"
        />
        <input
          type="password"
          v-model="loginData.pswd"
          autocomplete="off"
          placeholder="密码"
        />
        <input
          type="password"
          v-model="pswd2"
          autocomplete="off"
          placeholder="确认密码"
        />
        <div class="captcha">
          <input
            v-model="loginData.captcha"
            placeholder="验证码"
            type="text"
            autocomplete="off"
          />
          <img ref="captchaDom" alt="验证码看不清，换一张" @click="changeImg" />
        </div>
        <ElButton
          class="btn"
          @click="zc"
          size="large"
          :disable="
            !loginData.name.trim() || !loginData.pswd.trim() || !pswd2.trim()
          "
        >
          注册并登录
        </ElButton>
      </form>
    </div>
  </StructLogin>
</template>

<style scoped lang="less">
.title {
  font-size: 2.1rem;
  font-weight: bold;
  margin-bottom: 20px;

  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .right {
    display: flex;
    // flex-direction: column;
    align-items: center;
    font-size: 1rem;
    gap: 8px;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }
}

.qq-redirect {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;

  .title2 {
    font-size: 1.3em;
  }

  > form {
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
        -webkit-transition: color 99999s ease-out,
          background-color 99999s ease-out;
      }

      &:focus,
      &:hover {
        box-shadow: 1px 1px 2px 2px #0001;
      }
    }

    .captcha {
      display: flex;
      align-items: center;
      gap: 16px;

      input {
        flex: 1;
        width: 0;
      }

      img {
        height: 34px;
        cursor: pointer;
      }
    }
  }
}
</style>
