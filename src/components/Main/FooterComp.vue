<script setup lang="ts">
import dayjs from 'dayjs'

let User = { data: {} }

// 用户注册时间
// const userCreatetime = dayjs(User?.data?.userCreatetime).valueOf()
const userCreatetime = dayjs().valueOf()

const webRuntime = ref([0, 0, 0, 0])
const serverTime = ref([0, 0, 0, 0])
const pageRuntime = ref([0, 0, 0, 0])
// 建站时间
let startTime = dayjs('2021-11-21T22:25:20.000Z').valueOf()
let pageTime = dayjs().valueOf()

let timer = setInterval(() => {
  let lenth, d, h, m, time = dayjs().valueOf()
  // 建站运行时间
  lenth = Math.floor((time - startTime) / 1000)
  d = Math.floor(lenth / (60 * 60 * 24))
  lenth %= (60 * 60 * 24)
  h = Math.floor(lenth / (60 * 60))
  lenth %= (60 * 60)
  m = Math.floor(lenth / (60))
  lenth %= 60
  webRuntime.value = [d, h, m, lenth]
  // 页面运行时间
  lenth = Math.floor((time - pageTime) / 1000)
  m = Math.floor(lenth / (60))
  lenth %= 60
  pageRuntime.value = [d, h, m, lenth]

  // 服务时间

  lenth = Math.floor((time - userCreatetime) / 1000)
  d = Math.floor(lenth / (60 * 60 * 24))
  lenth %= (60 * 60 * 24)
  h = Math.floor(lenth / (60 * 60))
  lenth %= (60 * 60)
  m = Math.floor(lenth / (60))
  lenth %= 60
  serverTime.value = [d, h, m, lenth]

}, 1000)

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <footer v-m>
    <div class="center">
      <div class="statistic">
        <div>
          <div class="title">页面已运行</div>
          <div class="time">
            {{ pageRuntime[2] }}<i>分</i>
            {{ pageRuntime[3] }}<i>秒</i>
          </div>
        </div>
        <div>
          <el-tooltip content="从您注册时间到现在" placement="top">
            <div class="title">已为你服务</div>
          </el-tooltip>
          <div class="time">
            {{ serverTime[0] }}<i>天</i>
            {{ serverTime[1] }}<i>时</i>
            {{ serverTime[2] }}<i>分</i>
            {{ serverTime[3] }}<i>秒</i>
          </div>

        </div>
        <div>
          <div class="title">网站已成立</div>
          <div class="time">
            {{ webRuntime[0] }}<i>天</i>
            {{ webRuntime[1] }}<i>时</i>
            {{ webRuntime[2] }}<i>分</i>
            {{ webRuntime[3] }}<i>秒</i>
          </div>
        </div>
      </div>

      <div class="texts">
        <div class="item">
          <a href="https://www.loveyourself.cafe/" target="_black">一沫清茶</a>
          <a href="https://hcyx233.github.io/" target="_black">建哥のBLOG</a>
          <a href="https://www.sicau.edu.cn/" target="_black">川农官网</a>
          <a href="http://jiaowu.sicau.edu.cn/" target="_black">教务网</a>
          <a href="https://beian.miit.gov.cn/" target="_black">蜀ICP备2020030786号</a>
        </div>
        <div class="item">
          喜欢本站的话，不妨分享给你身边的同学们，万分感谢！
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="less">
footer {
  position: sticky;
  top: 100vh;
  margin-top: var(--gap);

  // 覆盖 -m 的一些样式
  border-bottom: 0;
  border-left: 0;
  border-right: 0;

  >.center {
    width: var(--center-width);
    transition:
      width 0.5s;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .statistic {
      display: flex;
      width: 100%;
      justify-content: space-around;

      .title {
        font-weight: 400;
        font-size: 12px;
        color: var(--mini-text-color);
        margin-bottom: 4px;
        margin-top: 10px;
        text-align: center;
      }

      .time {
        font-weight: 400;
        font-size: 20px;

      }

      i {
        font-size: 10px;
        color: var(--mini-text-color);
      }
    }

    .texts {
      margin: 10px 0;
      text-align: center;

      .item {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>