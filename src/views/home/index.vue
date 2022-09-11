<template>
  <div class="home">
    <h1 class="title">xiaopengyaa视频</h1>
    <van-button
      class="start-btn"
      color="#406e94"
      round
      plain
      size="large"
      @click="showSearch"
      >点我开始</van-button
    >
    <a href="http://xiaopengyaa.cn" target="_blank" class="home-page">
      <van-icon name="like" />
      <span class="text">My Home</span>
    </a>
  </div>
  <div class="home-bg" />
  <video-search v-model:visible="visible" />
</template>

<script setup lang="ts" name="home">
import VideoSearch from '@/components/search/video-search.vue'
// import { getImageUrl } from '@/utils/common'

const visible = ref(false)
// const bgGif = getImageUrl('starry.gif')
// const bgJpg = getImageUrl('starry-pre.jpg')
// const { isLoading } = useImage({ src: bgGif })
// const bgImg = computed(() => {
//   return isLoading.value ? `url(${bgJpg})` : `url(${bgGif})`
// })

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
    margin-bottom: 60px;
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
  // &::after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-image: v-bind(bgImg);
  //   background-size: cover;
  // }
}
</style>
