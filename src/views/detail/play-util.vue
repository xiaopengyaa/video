<template>
  <div class="play-util">
    <!-- <i class="iconfont icon-shuaxin" :class="{ start }" @click="refreshUrl" /> -->
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
import { ParserType } from '@/types/enum'

interface Props {
  type: ParserType
}

const props = defineProps<Props>()
const router = useRouter()
const title = useTitle()
const lines: ParserType[] = [ParserType.xmjx, ParserType.qgjx, ParserType.jyjx]
const type = useVModel(props, 'type')
// const start = ref(false)
const show = ref(false)
const sheetHeight = ref('')
const storageLine = useStorage<ParserType>(LINE_KEY, ParserType.xmjx)

watchEffect(() => {
  let line = lines[0]
  if (storageLine.value && lines.includes(storageLine.value)) {
    line = storageLine.value
  }
  type.value = line
})

onMounted(() => {
  const { width, height } = useWindowSize()
  sheetHeight.value = `${height.value - 0.5625 * width.value}px`
})

function handleClick(line: ParserType) {
  storageLine.value = line
  type.value = line
}

function isActiveLine(line: ParserType) {
  return type.value === line
}

// function refreshUrl() {
//   const temp = url.value
//   url.value = ''
//   start.value = true
//   setTimeout(() => {
//     url.value = temp
//     start.value = false
//   }, 1000)
// }

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
    cursor: pointer;
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
