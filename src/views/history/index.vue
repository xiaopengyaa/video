<template>
  <div class="history-page">
    <van-nav-bar
      title="观看历史"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon class="delete-icon" name="delete-o" :size="px2vw(18)" @click="onClearHistory" />
      </template>
    </van-nav-bar>
    <history-list class="list" />
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/store/history'
import { px2vw } from '@/utils/common'

const router = useRouter()
const historyStore = useHistoryStore()

function onClickLeft() {
  router.back()
}

// 清空记录
function onClearHistory() {
  showDialog({
    title: '提示',
    message: '确定清空全部记录吗？',
    showCancelButton: true,
  }).then(async (action) => {
    if (action === 'confirm') {
      await historyStore.clearHistoryAction()
    }
  })
}
</script>

<style lang="scss" scoped>
.history-page {
  --van-nav-bar-icon-color: #858593;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f8fa;
  overflow: hidden;
  .delete-icon {
    cursor: pointer;
  }
  .list {
    flex: 1;
    overflow: hidden;
  }
}
</style>
