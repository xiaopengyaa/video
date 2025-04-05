<template>
  <div class="history-list">
    <van-empty
      v-if="!historyList.length"
      class="custom-empty"
      image="search"
      description="暂无观看记录"
    />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        class="history-list-content"
        :finished="true"
        finished-text="没有更多了"
      >
        <div
          v-for="item in historyList"
          :key="item.id"
          class="history-item"
          @click="onItemClick(item)"
        >
          <div class="item-cover">
            <van-image
              :src="item.episodePoster"
              referrerpolicy="no-referrer"
              fit="cover"
              radius="4"
            />
            <van-progress
              class="progress-bar"
              color="#23ade5"
              stroke-width="2"
              track-color="transparent"
              :percentage="getProgressPercent(item)"
              :show-pivot="false"
            />
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
              <div class="time">
                {{ formatTime(item.lastWatchTime) }}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/store/history'
import type { HistoryItem } from '@/types/history'
import type { Site } from '@/types/enum'
import dayjs from 'dayjs'
import useListClick from './use-list-click'

const historyStore = useHistoryStore()
const { toDetail } = useListClick()
const { historyList, loading } = storeToRefs(historyStore)
const refreshing = ref(false)

// 初始化
onMounted(async () => {
  await historyStore.getHistoryListAction()
})

// 刷新
async function onRefresh() {
  refreshing.value = true
  await historyStore.getHistoryListAction()
  refreshing.value = false
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
  height: 100vh;
  padding: 16px;
  background-color: #fff;
  overflow: hidden;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .history-title {
    font-size: 18px;
    font-weight: 500;
    color: #323233;
    margin: 0;
  }

  .clear-btn {
    font-size: 13px;
  }
}

.custom-empty {
  padding: 80px 0;
}

.history-list-content {
  flex: 1;
  overflow: auto;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
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
        margin-top: 4px;
        @include text-ellipsis(2);
      }

      .time {
        flex-shrink: 0;
        font-size: 12px;
        margin-top: 4px;
        color: #666;
      }
    }
  }
}
</style>
