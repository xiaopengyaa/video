<template>
  <div class="profile">
    <van-nav-bar
      title="个人主页"
      left-arrow
      left-text="返回"
      :border="false"
      @click-left="toHome"
    />

    <div class="header">
      <div class="user-info">
        <van-image
          class="avatar"
          round
          fit="cover"
          :src="getImageUrl('avatar.jpg')"
        />
        <div class="info">
          <h3 class="name">
            {{ userInfo.username }}
          </h3>
          <p class="desc">
            这个人很懒，什么都没写~
          </p>
        </div>
      </div>
    </div>

    <div class="content">
      <van-cell-group inset>
        <van-cell
          title="观看历史"
          is-link
          @click="showHistory"
        >
          <template #icon>
            <van-icon name="clock-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="logout-btn">
        <van-button
          block
          round
          plain
          @click="onLogout"
        >
          退出账号
        </van-button>
      </div>
    </div>

    <!-- 历史记录弹窗 -->
    <van-popup
      v-model:show="showHistoryPopup"
      class="history-popup"
      position="bottom"
      round
      :lock-scroll="false"
    >
      <div class="popup-header">
        <h3>观看历史</h3>
        <van-icon
          v-show="list.length > 0"
          name="delete-o"
          @click="onClearHistory"
        />
      </div>
      <history-list ref="historyRef" class="list" />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useHistoryStore } from '@/store/history'
import HistoryList from '@/components/list/history-list.vue'
import { getImageUrl } from '@/utils/common'

const router = useRouter()
const authStore = useAuthStore()
const historyStore = useHistoryStore()
const { userInfo } = storeToRefs(authStore)
const { historyList: list } = storeToRefs(historyStore)
const historyRef = useTemplateRef<InstanceType<typeof HistoryList>>('historyRef')
const showHistoryPopup = ref(false)

watch(showHistoryPopup, () => {
  updateScroll()
})

onActivated(async () => {
  // 延迟一下，等历史记录更新完再刷新
  setTimeout(async () => {
    await historyRef.value?.onRefresh()
    updateScroll()
  }, 500)
})

function showHistory() {
  showHistoryPopup.value = true
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

function updateScroll() {
  if (showHistoryPopup.value) {
    setTimeout(() => {
      historyRef.value?.refreshScroll()
    }, 500)
  }
}

// 返回首页
function toHome() {
  router.push('/')
}

// 退出登录
function onLogout() {
  showDialog({
    title: '提示',
    message: '确定要退出账号吗？',
    showCancelButton: true,
  }).then((action) => {
    if (action === 'confirm') {
      authStore.logoutAction()
      router.push('/login')
    }
  })
}
</script>

<style lang="scss" scoped>
.profile {
  --van-nav-bar-background: #ededed;
  --van-nav-bar-icon-color: #000;
  --van-nav-bar-text-color: #000;
  --van-nav-bar-title-font-size: 16px;
  --van-nav-bar-arrow-size: 18px;
  height: 100%;
  padding-bottom: 14px;
  background-color: #ededed;
  user-select: none;
}

.header {
  padding: 14px;
  background-color: #fff;
  margin: 0 14px;
  margin-bottom: 14px;
  border-radius: 10px;

  .user-info {
    display: flex;
    align-items: center;

    .avatar {
      width: 50px;
      height: 50px;
      margin-right: 12px;
    }

    .info {
      flex: 1;
      overflow: hidden;

      .name {
        font-size: 18px;
        font-weight: bold;
        color: #323233;
        margin: 0 0 6px;
        @include text-ellipsis;
      }

      .desc {
        font-size: 12px;
        color: #666;
        margin: 0;
        @include text-ellipsis;
      }
    }
  }
}

.content {
  --van-cell-group-inset-padding: 14px;
  --van-cell-vertical-padding: 14px;
  --van-cell-horizontal-padding: 14px;
  margin-bottom: 14px;

  .cell-icon {
    margin-right: 8px;
    font-size: 18px;
    color: #323233;
  }

  :deep(.van-cell) {
    align-items: center;
  }

  .logout-btn {
    margin: 14px;

    :deep(.van-button) {
      color: #323233;
      border: none;
      background-color: #fff;
    }
  }
}

.history-popup {
  display: flex;
  flex-direction: column;
  height: 60%;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }

  .van-icon {
    font-size: 20px;
    color: #969799;
    cursor: pointer;
  }
}

.list {
  flex: 1;
  overflow: hidden;
}
</style>
