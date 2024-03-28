<!-- 

 -->
<script setup lang="ts">
import { ArrowLeftBold } from '@element-plus/icons-vue'
// import { useRoute } from 'vue-router'
const Route = useRoute()

const state = ref(2)
const user = reactive({ name: '', pswd: '', pswd2: '', data: {} })

onMounted(() => {
  //   if (QC.Login.check()) {
  //     // 如果是登录状态
  //     QC.api('get_user_info').success(res => (user.data = res.data)) // 先拿到用户信息
  //     if (hash.state == 'login') {
  //       // 登录
  //       QC.Login.getMe((openid, accessToken) => {
  //         // 拿到openId和accessToken
  //         // accessToken有有效时间，存入浏览器。openId唯一，存入数据库和账号绑定
  //         localStorage.setItem('accessToken', accessToken)
  //         user.openid = openid

  //         // 先看数据库有没有这个openId
  //         myPost('/user/getUsersCountByOpenidQ', { openid }, data => {
  //           if (data == 0) {
  //             // 没有就说明新人，①选择已有账户 ②新建账户
  //             state.value = 1 // 选择
  //           } else {
  //             // 1说明注册了，返回的是usertoken
  //             localStorage.setItem('username', user.name) // 只保存一个临时name
  //             localStorage.setItem('usertoken', data)
  //             console.log('登录成功')
  //             window.location = '/'
  //           }
  //         })
  //       })
  //     } else {
  //     } // 非登录，可能是绑定
  //   }
})

// 1.绑定已有账号
const bd = () => {
  if (!user.name || !user.pswd) {
    ElMessage('用户名或密码不能为空')
    return false
  }
  // 先登录获取token，再token和openid一起绑定
  myPost('/user/login', { username: user.name, password: user.pswd }, token => {
    if (token == '0') {
      ElMessage.error('用户名或密码不正确')
      return false
    } else {
      myPost(
        '/user/bind_openid',
        { usertoken: token, openid: user.openid },
        date => {
          ElMessage({ message: '绑定成功', type: 'success' })
          localStorage.setItem('username', user.name)
          localStorage.setItem('usertoken', token)
          window.location = '/'
        }
      )
    }
  })
}

// 2.用户选择注册新用户
// 获取QQ名作为默认名字，叫他设置用户名（万一被占用了）和密码
const handleNew = () => {
  state.value = 3
  user.name = user.data.nickname
  myPost(
    '/user/getUsersCountByUserName',
    { username: user.name },
    data => data && ElMessage.error('该用户名被占用了哦')
  )
}
// 点击注册
const zc = () => {
  // 普通校验
  if (!user.name.trim() || !user.pswd.trim() || !user.pswd2.trim()) {
    ElMessage.error('请输入相关信息')
    return false
  }
  if (user.pswd.trim() != user.pswd2.trim()) {
    ElMessage.error('两次密码不一致')
    return false
  }

  // 用户名占用
  myPost(
    '/user/getUsersCountByUserName',
    { username: user.name.trim() },
    data => {
      if (data) {
        ElMessage.error('该用户名被占用了哦')
        return false
      } else {
        // 没被占用，可以注册
        myPost(
          '/user/regist_qq',
          { username: user.name.trim(), password: user.pswd.trim() },
          usertoken => {
            myPost(
              '/user/bind_openid',
              {
                usertoken,
                openid: user.openid,
                userInfoQQ: JSON.stringify(user.data),
              },
              date => {
                ElMessage({ message: '注册成功', type: 'success' })
                // 设置用户头像为QQ头像
                localStorage.setItem('username', user.name)
                localStorage.setItem('usertoken', usertoken)
                myPost(
                  '/user/set/img',
                  { usertoken, value: user.data.figureurl_qq },
                  () => {
                    window.location = '/'
                  }
                )
              }
            )
          }
        )
      }
    }
  )
}
</script>

<template>
  <StructLogin>
    <div class="title">QQ登录</div>

    <div class="qq-redirect">
      <!-- {{ user }} -->

      <form v-if="state == 1">
        <div class="title2">没有找到对应的用户</div>
        <ElButton @click="state = 2" size="large">绑定已有账号</ElButton>
        <ElButton @click="handleNew" size="large">注册新用户</ElButton>
      </form>

      <!-- 绑定已有 -->
      <form v-if="state == 2">
        <div class="title2">
          <ElButton :icon="ArrowLeftBold" @click="state = 1" text circle />
          绑定已有账号
        </div>
        <input
          type="text"
          class="username"
          v-model="user.name"
          autocomplete="off"
          placeholder="用户名"
        />
        <input
          type="password"
          class="password"
          v-model="user.pswd"
          autocomplete="off"
          placeholder="密码"
        />
        <ElButton @click="bd" size="large">绑定并登录</ElButton>
      </form>

      <!-- 注册新用户 -->
      <form v-if="state == 3">
        <div class="title2">
          <ElButton :icon="ArrowLeftBold" @click="state = 1" text circle />
          注册新用户
        </div>
        <input
          type="text"
          v-model="user.name"
          autocomplete="off"
          placeholder="用户名"
        />
        <input
          type="password"
          v-model="user.pswd"
          autocomplete="off"
          placeholder="密码"
        />
        <input
          type="password"
          v-model="user.pswd2"
          autocomplete="off"
          placeholder="确认密码"
        />
        <ElButton class="btn" @click="zc">注册并登录</ElButton>
      </form>
    </div>
  </StructLogin>
</template>

<style scoped lang="less">
.title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.qq-redirect {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;

  .title2 {
    font-size: 1.3em;
    display: flex;
    align-items: center;
    gap: 12px;
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
  }
}
</style>
