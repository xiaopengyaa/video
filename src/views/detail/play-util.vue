<template>
  <div class="play-util">
    <i class="iconfont icon-shuaxin" :class="{ start }" @click="refreshUrl" />
    <i class="iconfont icon-shezhi1" @click="show = true" />
    <van-action-sheet
      v-model:show="show"
      class="action-sheel"
      title="更换播放线路"
      :closeable="false"
      :round="false"
    >
      <van-grid square>
        <van-grid-item
          v-for="(line, index) in lines"
          :key="index"
          :class="{ active: url === getPlayUrl(line) }"
          :icon="url === getPlayUrl(line) ? 'star' : 'star-o'"
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

interface Props {
  url: string
}

const props = defineProps<Props>()
const route = useRoute()
const lines = [
  'https://jx.aidouer.net/?url=',
  'https://okjx.cc/?url=',
  'https://jx.bozrc.com:4433/player/?url=',
  'https://jx.m3u8.tv/jiexi/?url=',
  'https://go.yh0523.cn/y.cy?url=',
  'https://jx.4kdv.com/?url=',
  'https://jx.ergan.top/?url=',
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

function refreshUrl() {
  const temp = url.value
  url.value = ''
  start.value = true
  setTimeout(() => {
    url.value = temp
    start.value = false
  }, 1000)
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

:deep() {
  .action-sheel {
    height: v-bind(sheetHeight);
  }
  .van-grid-item {
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
