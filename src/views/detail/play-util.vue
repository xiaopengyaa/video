<template>
  <div class="play-util">
    <i class="iconfont icon-shuaxin" :class="{ start }" @click="refreshUrl" />
    <i class="iconfont icon-shezhi1" @click="show = true" />
    <i class="iconfont icon-backdelete" @click="toHome" />
    <van-action-sheet
      v-model:show="show"
      class="util-action-sheel"
      title="更换播放线路"
      close-icon="arrow-down"
      teleport="body"
      :style="{
        height: sheetHeight,
      }"
      :round="false"
    >
      <van-grid>
        <van-grid-item
          v-for="(line, index) in lines"
          :key="index"
          :class="{ active: isActiveLine(line) }"
          :icon="isActiveLine(line) ? 'star' : 'star-o'"
          @click="handleClick(line)"
        >
          <template #text>
            <span class="van-grid-item__text">线路{{ index + 1 }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { LINE_KEY } from '@/utils/constant'
import { setTitle } from '@/utils/common'

interface Props {
  url: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const title = useTitle()
const lines = [
  'https://jx.aidouer.net/?url=',
  'https://jx.bozrc.com:4433/player/?url=',
  'https://jx.4kdv.com/?url=',
]
const url = useVModel(props, 'url')
const start = ref(false)
const show = ref(false)
const sheetHeight = ref('')
const storageLine = useStorage<string>(LINE_KEY, '')

watchEffect(() => {
  url.value = getPlayUrl(storageLine.value || lines[0])
})

onMounted(() => {
  const { width, height } = useWindowSize()
  sheetHeight.value = `${height.value - 0.5625 * width.value}px`
})

function handleClick(line: string) {
  storageLine.value = line
  url.value = getPlayUrl(line)
}

function getPlayUrl(line: string) {
  return line + route.query.url
}

function isActiveLine(line: string) {
  return url.value.includes(line)
}

function refreshUrl() {
  const temp = url.value
  url.value = ''
  start.value = true
  setTimeout(() => {
    url.value = temp
    start.value = false
  }, 1000)
}

function toHome() {
  title.value = setTitle('')
  router.push('/')
}
</script>

<style lang="scss" scoped>
.iconfont {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 24px;
  color: #848492;
  cursor: pointer;
  &.start {
    animation: rotation 1s ease-in-out;
    animation-iteration-count: infinite;
  }
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<style lang="scss">
.util-action-sheel {
  .van-action-sheet__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: bold;
    padding: 0 12px;
  }
  .van-action-sheet__close {
    font-size: 16px;
    color: #858593;
    padding: 0 12px;
  }
  .van-grid-item {
    cursor: pointer;
    .van-grid-item__content {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      height: 100%;
      padding: 16px 8px;
    }
    .van-grid-item__icon {
      font-size: 28px;
    }
    &.active {
      .van-grid-item__content {
        color: #ec6a38;
        background: linear-gradient(to top right, #fcf0ea, #fef7f4);
      }
      .van-grid-item__text {
        color: #ec6a38;
      }
    }
  }
}
</style>
