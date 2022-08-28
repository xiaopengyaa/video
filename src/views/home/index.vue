<template>
  <div class="home">
    <h1 class="title">xiaopengyaa视频</h1>
    <van-button
      class="start-btn"
      color="#7232dd"
      round
      plain
      size="large"
      @click="showSearch"
      >点我开始</van-button
    >
  </div>
  <div class="home-bg" />
  <video-search v-model:visible="visible" />
</template>

<script setup lang="ts" name="home">
import VideoSearch from '@/components/search/video-search.vue'

const visible = ref(false)

function showSearch() {
  visible.value = true
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
  text-shadow: 2px 2px 6px #d5ebe1;
  margin: 0 auto;
  overflow: hidden;
  .title {
    font-size: 2.5em;
    margin-bottom: 50px;
  }
  .start-btn {
    width: 200px;
    font-size: 22px;
    margin-bottom: 50px;
  }
}
.home-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/images/starry.gif');
  background-size: cover;
  z-index: -10;
}
</style>
