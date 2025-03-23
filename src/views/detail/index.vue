<template>
  <transition>
    <div v-show="true" class="detail">
      <div ref="videoRef" class="detail__video" />
      <LoadingSkeleton :loading="loading">
        <ScrollWrap
          v-show="playlist.length"
          ref="scrollRef"
          class="detail__content"
        >
          <div>
            <div class="detail__title-wrap">
              <div class="detail__title" @click="showIntro = true">
                <div class="title">
                  <van-image
                    v-show="getSiteLogo(site)"
                    class="logo"
                    :width="px2vw(22)"
                    :src="getSiteLogo(site)"
                  />
                  <span class="van-ellipsis">{{
                    detailData.introduction.title
                  }}</span>
                </div>
                <div v-if="detailData.introduction.detail_info" class="info">
                  <span
                    class="van-ellipsis"
                    v-html="detailData.introduction.detail_info"
                  />
                  <van-icon class="arrow" name="arrow" :size="px2vw(14)" />
                </div>
              </div>
              <PlayUtil
                v-if="!isEmpty"
                v-model:type="playType"
                class="detail__util"
              />
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
                <div
                  v-if="detailData.introduction.update_notify_desc"
                  class="update__desc van-multi-ellipsis--l2"
                >
                  {{ detailData.introduction.update_notify_desc }}
                </div>
              </div>
              <PlayList
                ref="playlistRef"
                v-model:active="active"
                :list="playlist"
                show-active
                @click="handleClick"
              />
            </div>
            <div v-show="detailData.topList.length" class="detail__top">
              <div class="title title-wrap">
                相关推荐
              </div>
              <RelateList
                ref="relateRef"
                :list="detailData.topList"
                :width="130"
                :height="74"
                @click="relateClick"
              />
            </div>
          </div>
        </ScrollWrap>
        <div v-if="isEmpty" class="detail__empty-wrap">
          <van-empty
            class="detail__empty"
            :image="getImageUrl('empty-image.png')"
            image-size="25vw"
            description="什么都没得~"
          />
          <PlayUtil v-model:type="playType" class="detail__empty-util" />
        </div>
      </LoadingSkeleton>
      <IntroDialog
        v-if="!isEmpty"
        v-model:visible="showIntro"
        :height="detailHeight"
        :data="detailData.introduction"
      />
      <PlaylistDialog
        v-if="!isEmpty"
        v-model:visible="showPlaylist"
        v-model:active="active"
        :list="playlist"
        :height="detailHeight"
        :desc="detailData.introduction.update_notify_desc || ''"
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
import { getImageUrl, getSiteLogo, px2vw } from '@/utils/common'
import { useRect } from '@vant/use'
import { ParserType } from '@/types/enum'

const videoRef = shallowRef<HTMLDivElement>()
const playType = ref<ParserType>(ParserType.xmjx)
const playlistRef = shallowRef<typeof PlayList>()
const relateRef = shallowRef<typeof RelateList>()
const scrollRef = shallowRef<typeof ScrollWrap>()
const showIntro = ref(false)
const showPlaylist = ref(false)
const detailHeight = ref('')

const { cid, site } = useVideo(videoRef, playType)
const {
  detailData,
  playlist,
  active,
  loading,
  isEmpty,
  handleClick,
  relateClick,
} = useContent(cid, site)

watch(loading, () => {
  setTimeout(() => {
    const { height } = useRect(scrollRef.value?.$el)
    detailHeight.value = `${height}px`
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
  background: #fff;
  user-select: none;
  .title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: bold;
  }
  &__video {
    width: 100vw;
    height: 56.25vw;
    background: #000;
  }
  &__empty-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  &__empty-util {
    position: absolute;
    right: 12px;
    top: 8px;
  }
  &__empty {
    height: 100%;
  }
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 12px 12px;
    overflow: hidden;
  }
  &__title-wrap {
    display: flex;
  }
  &__title {
    flex: 1;
    margin-top: 16px;
    overflow: hidden;
    cursor: pointer;
    .title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      margin-right: 10px;
      .logo {
        flex-shrink: 0;
        margin-right: 6px;
      }
    }
    .info {
      display: flex;
      align-items: center;
      color: #848492;
      margin: 8px 0;
    }
  }
  &__util {
    margin-top: 8px;
  }
  &__play {
    margin-top: 40px;
    .update {
      cursor: pointer;
      margin-bottom: 12px;
      &__desc {
        color: #848492;
        margin-top: 6px;
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
