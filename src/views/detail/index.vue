<template>
  <transition>
    <div class="detail">
      <van-icon
        class="detail__back"
        color="#fff"
        :size="px2vw(20)"
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
        <scroll-wrap
          v-show="playlist.length"
          ref="scrollRef"
          class="detail__content"
        >
          <div>
            <div class="detail__title" @click="showIntro = true">
              <div class="title">{{ detailData.introduction.title }}</div>
              <div class="info">
                <span v-html="detailData.introduction.detail_info" />
                <span>&nbsp;· 简介</span>
                <van-icon class="arrow" name="arrow" :size="px2vw(12)" />
              </div>
            </div>
            <div class="detail__play">
              <div class="update" @click="showPlaylist = true">
                <div class="update__title title-wrap">
                  剧集与更新
                  <van-icon
                    class="arrow"
                    name="arrow"
                    color="#848492"
                    :size="px2vw(16)"
                  />
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
            <div v-show="detailData.topList.length" class="detail__top">
              <div class="title title-wrap">相关推荐</div>
              <relate-list
                ref="relateRef"
                :list="detailData.topList"
                :width="130"
                :height="74"
                @click="relateClick"
              />
            </div>
          </div>
        </scroll-wrap>
        <play-util
          v-show="utilTop"
          v-model:url="playUrl"
          class="detail__util"
          :style="{
            top: utilTop,
          }"
        />
        <van-empty
          v-show="isEmpty"
          class="detail__empty"
          :image="getImageUrl('empty-image.png')"
          image-size="25vw"
          description="什么都没得~"
        />
      </loading-skeleton>
      <intro-dialog
        v-if="!isEmpty"
        v-model:visible="showIntro"
        :height="detailHeight"
        :data="detailData.introduction"
      />
      <playlist-dialog
        v-if="!isEmpty"
        v-model:visible="showPlaylist"
        v-model:active="active"
        :list="playlist"
        :height="detailHeight"
        :desc="detailData.introduction.update_notify_desc"
      />
    </div>
  </transition>
</template>

<script setup lang="ts" name="detail">
import PlayList from '@/components/list/play-list.vue'
import LoadingSkeleton from '@/components/skeleton/loading-skeleton.vue'
import ScrollWrap from '@/components/scroll/scroll-wrap.vue'
import RelateList from '@/components/list/relate-list.vue'
import IntroDialog from './intro-dialog.vue'
import PlaylistDialog from './playlist-dialog.vue'
import PlayUtil from './play-util.vue'
import useContent from './use-content'
import useVideo from './use-video'
import { LOADING_DELAY } from '@/utils/constant'
import { px2vw, getImageUrl } from '@/utils/common'
import { useRect } from '@vant/use'

const playUrl = ref('')
const playlistRef = ref<typeof PlayList>()
const relateRef = ref<typeof RelateList>()
const scrollRef = ref<typeof ScrollWrap>()
const showIntro = ref(false)
const showPlaylist = ref(false)
const detailHeight = ref('')
const utilTop = ref('')

const { cid, site, series, backTop } = useVideo(playUrl)
const {
  detailData,
  playlist,
  active,
  loading,
  isEmpty,
  toHome,
  handleClick,
  relateClick,
} = useContent(cid, site)

watch(loading, () => {
  setTimeout(() => {
    const { height } = useRect(scrollRef.value?.$el)
    const { width: winW } = useWindowSize()
    detailHeight.value = height + 'px'
    utilTop.value = 0.5625 * winW.value + 8 + 'px'

    playlistRef.value?.scrollToActive()
    relateRef.value?.scroll?.scrollTo(0, 0, 800)
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
  .title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: bold;
  }
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
  &__util {
    position: absolute;
    right: 10px;
  }
  &__empty {
    flex: 1;
    overflow: hidden;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 12px 12px;
    overflow: hidden;
  }
  &__title {
    margin-top: 16px;
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-right: 90px;
    }
    .info {
      display: flex;
      align-items: center;
      color: #848492;
      margin: 8px 0;
      .arrow {
        margin-top: 2px;
      }
    }
  }
  &__play {
    margin-top: 40px;
    .update {
      &__desc {
        color: #848492;
        margin: 6px 0 12px;
      }
    }
  }
  &__top {
    margin-top: 40px;
    margin-bottom: 20px;
    .title {
      margin-bottom: 12px;
    }
  }
}
</style>
