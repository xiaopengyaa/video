<template>
  <div class="history-list">
    <empty v-if="finished && !historyList.length" />
    <scroll-wrap
      v-else
      ref="scrollRef"
      v-model:loading="loading"
      v-model:refreshing="refreshing"
      class="scroll-wrap"
      :finished="finished"
      @load="onLoad"
      @refresh="onRefresh"
    >
      <div>
        <div
          v-for="item in historyList"
          :key="item.id"
          class="history-item"
          @click="onItemClick(item)"
        >
          <div class="item-cover">
            <van-image
              :src="item.episodePoster"
              fit="cover"
              radius="4"
            />
            <div class="mask" />
            <van-progress
              class="progress-bar"
              color="#23ade5"
              stroke-width="2"
              track-color="transparent"
              :percentage="getProgressPercent(item)"
              :show-pivot="false"
            />
            <div class="time">
              {{ formatTime(item.lastWatchTime) }}
            </div>
          </div>
          <div class="item-info">
            <div class="info-header">
              <h4 class="title">
                {{ item.episodeName }}
              </h4>
              <div class="episode">
                <span class="episode-text">{{ getVideoText(item.videoText) }}</span>
                ·
                <span class="progress-text">{{ getProgressText(item) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-wrap>
  </div>
</template>

<script setup lang="ts">
import ScrollWrap from '@/components/scroll/scroll-wrap.vue'
import { useHistoryStore } from '@/store/history'
import type { HistoryItem } from '@/types/history'
import type { Site } from '@/types/enum'
import dayjs from 'dayjs'
import useListClick from './use-list-click'

const scrollRef = useTemplateRef<InstanceType<typeof ScrollWrap>>('scrollRef')
const historyStore = useHistoryStore()
const { toDetail } = useListClick()
const { historyList, historyTotal, loading, page, pageSize } = storeToRefs(historyStore)
const refreshing = ref(false)
const finished = ref(false)
const pageTotal = computed(() => {
  return Math.ceil(historyTotal.value / pageSize.value)
})

defineExpose({
  refreshScroll,
  onRefresh,
})

// 初始化
onMounted(async () => {
  await onRefresh()
})

// 刷新scroll组件
function refreshScroll() {
  scrollRef.value?.scroll.refresh()
}

// 加载更多
async function onLoad() {
  if (finished.value) {
    return
  }

  page.value++
  await historyStore.getHistoryListAction()

  // 判断是否加载完成
  if (page.value >= pageTotal.value) {
    finished.value = true
  }
}

// 刷新列表
async function onRefresh() {
  refreshing.value = true
  page.value = 1
  finished.value = false

  await historyStore.getHistoryListAction()

  refreshing.value = false

  // 判断是否加载完成
  if (page.value >= pageTotal.value) {
    finished.value = true
  }
}

// 点击项目
function onItemClick(item: HistoryItem) {
  toDetail({
    href: item.videoUrl,
    site: item.videoSite as Site,
    progress: item.watchProgress,
  })
}

// 获取进度百分比
function getProgressPercent(item: HistoryItem) {
  if (item.totalDuration === 0) {
    return '0'
  }
  return (item.watchProgress / item.totalDuration * 100).toFixed(2)
}

// 获取进度文本
function getProgressText(item: HistoryItem) {
  const percent = getProgressPercent(item)
  if (Number(percent) < 1) {
    return '观看不足1%'
  }
  else if (Number(percent) >= 100) {
    return '已看完'
  }
  else {
    return `观看至${Number.parseInt(percent)}%`
  }
}

// 处理视频集数
function getVideoText(text: string) {
  if (Number.isNaN(Number(text))) {
    return text
  }
  return `第${text.padStart(2, '0')}集`
}

// 格式化时间
function formatTime(time: string) {
  return dayjs(time).fromNow().replace(/\s+/g, '')
}
</script>

<style lang="scss" scoped>
.history-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #fff;
  overflow: hidden;
}

.scroll-wrap {
  height: 100%;
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  user-select: none;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  .item-cover {
    position: relative;
    width: 120px;
    height: 68px;
    margin-right: 12px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;

    .van-image {
      width: 100%;
      height: 100%;
    }

    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 11;
    }

    .mask {
      position: absolute;
      height: 20px;
      left: 0;
      bottom: 0;
      background: linear-gradient(360deg, rgba(0, 0, 0, 0.399257) 2.29%, rgba(0, 0, 0, 0.0001) 99.71%);
      z-index: 10;
      width: 100%;
    }

    .time {
      position: absolute;
      bottom: 4px;
      right: 4px;
      font-size: 10px;
      color: #fff;
      z-index: 11;
    }
  }

  .item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .info-header {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title {
        flex: 1;
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        color: #323233;
        line-height: 1.4;
        @include text-ellipsis;
      }

      .episode {
        font-size: 12px;
        color: #666;
        margin-top: 6px;
        @include text-ellipsis(2);
      }
    }
  }
}
</style>
