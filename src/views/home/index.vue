<template>
  <div class="home">
    <van-image
      class="avatar"
      round
      fit="cover"
      :src="getImageUrl('avatar.webp')"
      @click="toProfile"
    />
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
    <a href="http://xiaopengyaa.cn" target="_blank" class="home-page">
      <van-icon name="like" />
      <span class="text">My Home</span>
    </a>
  </div>
  <div class="home-bg" />
  <video-search v-model:visible="visible" />
</template>

<script setup lang="ts" name="home">
import { getImageUrl } from '@/utils/common'
import { APP_NAME } from '@/utils/constant'

const router = useRouter()
const visible = ref(false)
const appName = ref(APP_NAME)

function showSearch() {
  visible.value = true
}

function toProfile() {
  router.push('/profile')
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
  .avatar {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    z-index: 1;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
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
  .home-page {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: #fff;
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
