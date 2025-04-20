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
        <van-cell
          title="意见反馈"
          is-link
          @click="showFeedback"
        >
          <template #icon>
            <van-icon name="comment-o" class="cell-icon" />
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

    <!-- 意见反馈弹窗 -->
    <van-popup
      v-model:show="showFeedbackPopup"
      class="feedback-popup"
      position="bottom"
      round
    >
      <div class="popup-header">
        <h3>意见反馈</h3>
        <van-icon name="cross" @click="showFeedbackPopup = false" />
      </div>
      <div class="feedback-content">
        <van-field
          v-model.trim="feedback.content"
          type="textarea"
          rows="6"
          placeholder="请输入您的意见或建议"
          show-word-limit
          maxlength="100"
        />
        <div class="submit-btn">
          <van-button
            block
            round
            type="primary"
            :loading="submitting"
            @click="onSubmitFeedback"
          >
            提交
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useHistoryStore } from '@/store/history'
import HistoryList from '@/components/list/history-list.vue'
import { getImageUrl } from '@/utils/common'
import { submitFeedback } from '@/api/base'
import type { FeedbackParams } from '@/types/base'
import { showDialog, showToast } from 'vant'

const router = useRouter()
const authStore = useAuthStore()
const historyStore = useHistoryStore()
const { userInfo } = storeToRefs(authStore)
const { historyList: list } = storeToRefs(historyStore)
const historyRef = useTemplateRef<InstanceType<typeof HistoryList>>('historyRef')
const showHistoryPopup = ref(false)
const showFeedbackPopup = ref(false)
const submitting = ref(false)
const feedback = ref<FeedbackParams>({
  content: '',
})

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

function showFeedback() {
  showFeedbackPopup.value = true
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

// 提交反馈
async function onSubmitFeedback() {
  if (!feedback.value.content) {
    showToast('请输入您的意见或建议')
    return
  }

  submitting.value = true
  try {
    const result = await submitFeedback(feedback.value)
    if (result.flag) {
      showToast('提交成功')
      showFeedbackPopup.value = false
      feedback.value = {
        content: '',
      }
    }
    else {
      showToast(result.message || '提交失败')
    }
  }
  finally {
    submitting.value = false
  }
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

.feedback-popup {
  display: flex;
  flex-direction: column;
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

.feedback-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;

  .submit-btn {
    margin-top: 20px;
  }
}

.list {
  flex: 1;
  overflow: hidden;
}
</style>
