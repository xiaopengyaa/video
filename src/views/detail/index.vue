<template>
  <transition>
    <div v-show="true" class="detail">
      <div ref="videoRef" class="detail__video" />
      <loading-skeleton :loading="loading">
        <scroll-wrap
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
                <div v-if="detailData.introduction.detailInfo" class="info">
                  <span
                    class="van-ellipsis"
                    v-html="detailData.introduction.detailInfo"
                  />
                  <van-icon class="arrow" name="arrow" :size="px2vw(14)" />
                </div>
              </div>
              <play-util
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
                  v-if="detailData.introduction.update"
                  class="update__desc van-multi-ellipsis--l2"
                >
                  {{ detailData.introduction.update }}
                </div>
              </div>
              <play-list
                ref="playlistRef"
                v-model:active="vid"
                :list="playlist"
                show-active
                @click="handleClick"
              />
            </div>
            <div v-show="detailData.topList.length" class="detail__top">
              <div class="title title-wrap">
                相关推荐
              </div>
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
        <div v-if="isEmpty" class="detail__empty-wrap">
          <empty />
          <play-util v-model:type="playType" class="detail__empty-util" />
        </div>
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
        v-model:active="vid"
        :list="playlist"
        :height="detailHeight"
        :desc="detailData.introduction.update || ''"
      />
    </div>
  </transition>
</template>

<script setup lang="ts" name="detail">
import PlayList from '@/components/list/play-list.vue'
import ScrollWrap from '@/components/scroll/scroll-wrap.vue'
import RelateList from '@/components/list/relate-list.vue'
import IntroDialog from './intro-dialog.vue'
import PlaylistDialog from './playlist-dialog.vue'
import PlayUtil from './play-util.vue'
import useContent from './use-content'
import useVideo from './use-video'
import { LOADING_DELAY, PROGRESS_KEY } from '@/utils/constant'
import { getSiteLogo, px2vw } from '@/utils/common'
import { useRect } from '@vant/use'
import { ParserType } from '@/types/enum'
import { updateHistory } from '@/api/history'
import browser from '@/utils/page-check'

const playType = ref<ParserType>(ParserType.xmjx)
const videoRef = useTemplateRef<HTMLDivElement>('videoRef')
const playlistRef = useTemplateRef<InstanceType<typeof PlayList>>('playlistRef')
const relateRef = useTemplateRef<InstanceType<typeof RelateList>>('relateRef')
const scrollRef = useTemplateRef<InstanceType<typeof ScrollWrap>>('scrollRef')
const showIntro = ref(false)
const showPlaylist = ref(false)
const detailHeight = ref('')

const { url, site, art } = useVideo(videoRef, playType)
const {
  detailData,
  playlist,
  cid,
  vid,
  loading,
  isEmpty,
  handleClick,
  relateClick,
} = useContent(site)
const progressStorage = useLocalStorage(PROGRESS_KEY, '')

const vidText = computed(() => {
  return playlist.value.find(item => item.vid === vid.value)?.text || ''
})

watch(loading, () => {
  setTimeout(() => {
    const { height } = useRect(scrollRef.value?.$el)
    detailHeight.value = `${height}px`
    playlistRef.value?.scrollToActive()
    relateRef.value?.scroll.scrollTo(0, 0, 800)
  }, LOADING_DELAY + 100)
})

onMounted(() => {
  // 监听卸载事件
  if (browser.versions.ios) {
    window.addEventListener('pagehide', handleUnload)
  }
  else {
    window.addEventListener('beforeunload', handleUnload)
  }
})

onBeforeUnmount(() => {
  // 更新历史记录
  update()
  // 销毁播放器
  art.value?.destroy(false)
  // 卸载事件
  if (browser.versions.ios) {
    window.removeEventListener('pagehide', handleUnload)
  }
  else {
    window.removeEventListener('beforeunload', handleUnload)
  }
})

function handleUnload() {
  update()
  setProgress(art.value?.currentTime)
}

function setProgress(currentTime?: number) {
  if (currentTime > 0) {
    progressStorage.value = currentTime.toFixed(0)
  }
}

function update() {
  if (art.value?.duration > 0) {
    updateHistory({
      videoId: vid.value,
      videoUrl: url.value,
      videoSite: site.value,
      videoText: vidText.value,
      episodeId: cid.value,
      episodeName: detailData.value.introduction.title,
      episodePoster: detailData.value.introduction.poster,
      watchProgress: art.value.currentTime,
      totalDuration: art.value.duration,
    })
  }
}
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
    :deep(.van-empty__image) {
      margin-top: 0;
    }
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
