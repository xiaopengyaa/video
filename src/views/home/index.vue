<template>
  <div class="home">
    <h1 class="title">
      {{ appName }}
    </h1>
    <van-button
      class="start-btn"
      color="#406e94"
      round
      plain
      size="large"
      @click="showSearch"
    >
      点我开始
    </van-button>
    <div class="action-links">
      <router-link to="/history" class="history-link">
        <van-icon name="clock-o" />
        <span class="text">观看历史</span>
      </router-link>
      <a href="http://xiaopengyaa.cn" target="_blank" class="home-page">
        <van-icon name="like" />
        <span class="text">My Home</span>
      </a>
    </div>
  </div>
  <div class="home-bg" />
  <video-search v-model:visible="visible" />
</template>

<script setup lang="ts" name="home">
import { APP_NAME } from '@/utils/constant'

const visible = ref(false)
const appName = ref(APP_NAME)

function showSearch() {
  visible.value = true
}
</script>

<style lang="scss">
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
  margin: 0 auto;
  overflow: hidden;
  .title {
    font-size: 2.5em;
    margin-bottom: 40px;
    text-shadow: 2px 2px 6px #d5ebe1;
  }
  .start-btn {
    width: 200px;
    font-size: 22px;
    margin-bottom: 40px;
  }
  .action-links {
    display: flex;
    align-items: center;
    gap: 20px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .history-link,
  .home-page {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #fff;
    text-decoration: none;
    .text {
      margin-left: 8px;
      text-shadow: 2px 2px 6px #d5ebe1;
    }
  }
}
.home-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/images/bg1.jpg');
  background-size: cover;
  z-index: -10;
}
</style>
