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
      <loading-skeleton :loading="loading">
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
              ref="playlistRef"
              v-model:active="active"
              :list="playlist"
              :series="series"
              show-active
              @click="handleClick"
            />
          </div>
        </div>
      </loading-skeleton>
    </div>
  </transition>
</template>

<script setup lang="ts" name="detail">
import PlayList from '@/components/list/play-list.vue'
import LoadingSkeleton from '@/components/skeleton/loading-skeleton.vue'
import useContent from './use-content'
import { LOADING_DELAY } from '@/utils/constant'

const route = useRoute()
const playUrl = ref('')
const cid = ref('')
const series = ref('')
const playlistRef = ref<typeof PlayList>()

watchEffect(() => {
  // playUrl.value = `https://m2090.com/?url=${route.query.url}`
  playUrl.value = `https://okjx.cc/?url=${route.query.url}`
  // playUrl.value = `https://jx.bozrc.com:4433/player/?url=${route.query.url}`
  cid.value = route.query.cid as string
  series.value = route.query.series as string
})

const { detailData, playlist, active, loading, toHome, handleClick } =
  useContent(cid)

const backTop = computed(() => {
  const urls = ['okjx.cc']
  const flag = urls.some((url) => {
    return playUrl.value.includes(url)
  })
  return flag ? '50px' : '20px'
})

watch(loading, () => {
  setTimeout(() => {
    playlistRef.value?.scrollToActive()
  }, LOADING_DELAY + 100)
})
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
    top: v-bind(backTop);
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
    display: flex;
    flex-direction: column;
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
