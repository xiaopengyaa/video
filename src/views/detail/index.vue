<template>
  <transition>
    <div class="detail">
      <van-icon
        class="detail__back"
        color="#fff"
        size="20"
        name="arrow-left"
        @click="toHome"
      />
      <iframe
        class="detail__video"
        allowtransparency="true"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
        autoplay="true"
        :src="playUrl"
      />
      <div class="detail__content">
        <div class="detail__title">
          <div class="title">{{ detailData.introduction.title }}</div>
          <div class="info" v-html="detailData.introduction.detail_info" />
        </div>
        <div class="detail__play">
          <div class="update">
            <div
              v-show="
                detailData.introduction.update_notify_desc || playlist.length
              "
              class="update__title"
            >
              剧集与更新
            </div>
            <div class="update__desc">
              {{ detailData.introduction.update_notify_desc }}
            </div>
          </div>
          <play-list
            v-model:active="active"
            :list="playlist"
            :series="series"
            show-active
            @click="handleClick"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts" name="detail">
import PlayList from '@/components/list/play-list.vue'
import useContent from './use-content'

const route = useRoute()
const playUrl = ref('')
const cid = ref('')
const series = ref('')

watchEffect(() => {
  // playUrl.value = `https://m2090.com/?url=${route.query.url}`
  // playUrl.value = `https://okjx.cc/?url=${route.query.url}`
  // playUrl.value = `https://jx.bozrc.com:4433/player/?url=${route.query.url}`
  cid.value = route.query.cid as string
  series.value = route.query.series as string
})

const { detailData, playlist, active, toHome, handleClick } = useContent(cid)
</script>

<style lang="scss" scoped>
.detail {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &__back {
    position: absolute;
    top: 20px;
    left: 14px;
    z-index: 10;
  }
  &__video {
    width: 100vw;
    height: 56.25vw;
    background: #000;
  }
  &__content {
    flex: 1;
    padding: 0 12px;
    overflow: hidden;
  }
  &__title {
    margin-top: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .info {
      color: #848492;
      margin: 8px 0;
    }
  }
  &__play {
    margin-top: 50px;
    .update {
      &__title {
        font-size: 16px;
        font-weight: bold;
      }
      &__desc {
        color: #848492;
        margin: 6px 0 12px;
      }
    }
  }
}
</style>
