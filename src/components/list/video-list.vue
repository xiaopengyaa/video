<template>
  <div class="video-list">
    <div v-for="(item, index) in list" :key="index" class="video-item">
      <div class="main-content">
        <div class="main-content__left">
          <van-image width="130" height="180" radius="4" :src="item.image" />
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

<style lang="scss">
.video-item {
  padding: 12px;
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
      font-size: 26px;
      color: #ec6a38;
      margin-bottom: 14px;
    }
    .sub-item {
      display: inline-block;
      background: #f6f8fa;
      padding: 4px 8px;
      margin-right: 6px;
    }
    .desc {
      margin-top: 14px;
    }
  }
}
</style>
