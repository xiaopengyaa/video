<template>
  <div class="video-list">
    <div v-for="(item, index) in list" :key="index" class="video-item">
      <div class="main-content" @click="btnClick(item)">
        <div class="main-content__left">
          <van-image
            :width="px2vw(90)"
            :height="px2vw(126)"
            :radius="px2vw(4)"
            :src="item.image"
          />
          <div
            v-if="item.mark"
            class="mark"
            :style="{
              backgroundColor: item.mark.backgroundColor,
              color: item.mark.fontColor,
            }"
          >
            <div>{{ item.mark.text }}</div>
          </div>
          <div class="image-info-wrap">
            <div class="image-info van-ellipsis">
              {{ item.imageInfo }}
            </div>
          </div>
        </div>
        <div class="main-content__right">
          <div class="title" v-html="item.title" />
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
          <van-button
            v-if="item.btnlist.length <= 1"
            class="btn"
            round
            block
            color="#ec6a38"
            @click="btnClick(item)"
          >
            立即播放
          </van-button>
          <van-popover
            v-else-if="popoverList[index]"
            v-model:show="popoverList[index].show"
            theme="dark"
            placement="top"
            :actions="popoverList[index].actions"
            @select="(playItem: PlayItem) => playClick(playItem, item)"
          >
            <template #reference>
              <van-button
                class="btn"
                round
                block
                color="#ec6a38"
                icon="arrow-down"
                icon-position="right"
              >
                立即播放
              </van-button>
            </template>
          </van-popover>
        </van-col>
        <van-col span="12">
          <van-button
            class="btn download"
            round
            block
            color="#f6f8fa"
            @click="download"
          >
            <template #icon>
              <i class="iconfont icon-download3" />
            </template>
            下载
          </van-button>
        </van-col>
      </van-row>
      <play-list
        v-show="item.playlist.length"
        :list="item.playlist"
        @click="(playItem: PlayItem) => playClick(playItem, item)"
      />
    </div>
    <div v-show="relateList.length" class="video-item">
      <div class="relate-title">
        相关影视作品
      </div>
      <relate-list
        :list="relateList"
        @click="btnClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RelateList from './relate-list.vue'
import useListClick from './use-list-click'
import type { PlayItem, SearchItem } from '@/types/search'
import { showToast } from 'vant'
import { px2vw } from '@/utils/common'
import 'vant/es/toast/style'

interface Props {
  query: string
  list: SearchItem[]
  relateList: SearchItem[]
}
interface PopoverItem {
  show: boolean
  actions: PlayItem[]
}

const props = defineProps<Props>()
const popoverList = ref<PopoverItem[]>([])
const { btnClick, playClick } = useListClick()

watchEffect(() => {
  popoverList.value = props.list.map((item) => {
    return {
      show: false,
      actions: item.btnlist,
    }
  })
})

function download() {
  showToast('想什么呢，你还想下载=。=')
}
</script>

<style lang="scss" scoped>
.video-item {
  padding: 12px;
  &:not(:first-child) {
    border-top: 8px solid #f6f8fa;
  }
}

.main-content {
  display: flex;
  align-items: center;
  cursor: pointer;
  &__left {
    position: relative;
    .mark {
      position: absolute;
      top: 0;
      right: 0;
      padding-left: 6px;
      padding-right: 6px;
      height: 16px;
      line-height: 16px;
      border-bottom-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  &__right {
    flex: 1;
    margin-left: 12px;
    overflow: hidden;
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
      :deep(.main) {
        color: #ec6a38;
      }
    }
    .sub-item {
      display: inline-block;
      background: #f6f8fa;
      padding: 4px 8px;
      margin-right: 6px;
      margin-top: 10px;
      border-radius: 2px;
    }
    .desc {
      margin-top: 14px;
    }
  }
}

.relate-title {
  font-size: 14px;
  font-weight: bold;
  color: #ec6a38;
  margin: 2px 0 12px;
}

.btn-wrap {
  margin: 12px 0;
  .btn {
    height: 40px;
    .iconfont {
      font-size: 14px;
    }
  }
  :deep(.download .van-button__content) {
    color: #000;
  }
  :deep(.van-popover__wrapper) {
    width: 100%;
  }
}
</style>
