<template>
  <div class="video-list">
    <div v-for="(item, index) in list" :key="index" class="video-item">
      <div class="main-content">
        <div class="main-content__left">
          <van-image width="90" height="128" radius="4" :src="item.image" />
          <div v-if="item.mark" class="mark">
            <van-image :src="item.mark" />
          </div>
        </div>
        <div class="main-content__right">
          <div class="title">{{ item.title }}</div>
          <div class="sub">
            <div
              v-for="(sItem, sIndex) in item.sub"
              :key="sIndex"
              class="sub-item"
            >
              {{ sItem }}
            </div>
          </div>
          <div class="desc van-multi-ellipsis--l2">
            {{ item.desc }}
          </div>
        </div>
      </div>
      <van-row gutter="12" class="btn-wrap">
        <van-col span="12">
          <van-button class="btn" round block color="#ec6a38"
            >立即播放</van-button
          >
        </van-col>
        <van-col span="12">
          <van-button
            class="btn download"
            round
            block
            color="#f6f8fa"
            icon="star"
          >
            缓存
          </van-button>
        </van-col>
      </van-row>
      <play-list :list="item.playlist" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchItem } from '@/types/search'

interface Props {
  list: SearchItem[]
}

const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.video-item {
  padding: 12px;
  &:not(:last-child) {
    border-bottom: 8px solid #f6f8fa;
  }
}
.main-content {
  display: flex;
  align-items: center;
  &__left {
    position: relative;
    .mark {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  &__right {
    flex: 1;
    margin-left: 12px;
    overflow: hidden;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #ec6a38;
      margin-bottom: 14px;
    }
    .sub-item {
      display: inline-block;
      background: #f6f8fa;
      padding: 4px 8px;
      margin-right: 6px;
      border-radius: 2px;
    }
    .desc {
      margin-top: 14px;
    }
  }
}
.btn-wrap {
  margin: 12px 0;
  .btn {
    height: 40px;
  }
  :deep(.download .van-button__content) {
    color: #000;
  }
}
</style>
