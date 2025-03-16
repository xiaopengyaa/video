<template>
  <div
    ref="rootRef"
    class="play-list-wrap"
    :class="{
      'play-list-wrap--vertical': isVertical,
    }"
  >
    <div
      ref="playlistRef"
      class="play-list"
      :class="{
        'is-series': isSeries,
      }"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item van-ellipsis"
        :class="{
          active: showActive && active === item.vid,
        }"
        @click="handleClick(item)"
      >
        {{ item.text }}
        <div
          v-if="item.mark"
          :style="{
            backgroundColor: item.mark.backgroundColor,
            color: item.mark.fontColor,
          }"
          class="mark"
        >
          {{ item.mark.text }}
        </div>
      </div>
      <template v-if="isVertical">
        <div
          v-for="num in emptyItemLen"
          :key="num"
          class="item van-ellipsis item--empty"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayItem } from '@/types/search'
import useScroll from '@/components/scroll/use-scroll'

interface Props {
  active?: string
  showActive?: boolean
  direction?: 'vertical' | 'horizontal'
  list: PlayItem[]
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
  (event: 'click', item: PlayItem): void
  (event: 'update:active', text: string): void
}

const props = withDefaults(defineProps<Props>(), {
  active: '',
  showActive: false,
  direction: 'horizontal',
})

const emit = defineEmits<Emits>()

defineExpose({
  scrollToActive,
  refreshScroll,
})

const ITEM_ROW_LEN = 6
const SERIES_ROW_LEN = 2
const rootRef = shallowRef<HTMLElement | null>(null)
const playlistRef = shallowRef<HTMLElement | null>(null)
const isVertical = computed(() => props.direction === 'vertical')
const isSeries = computed<boolean>(() => {
  if (props.list.length) {
    return Number.isNaN(Number(props.list[0].text))
  }
  return false
})
const emptyItemLen = computed(() => {
  const rowLen = isSeries.value ? SERIES_ROW_LEN : ITEM_ROW_LEN
  const extraLen = props.list.length % rowLen
  if (extraLen === 0) {
    return extraLen
  }
  return rowLen - extraLen
})
const scroll = useScroll(
  rootRef,
  {
    click: true,
    scrollX: !isVertical.value,
    scrollY: isVertical.value,
  },
  emit,
)

onUpdated(() => {
  setTimeout(() => {
    scrollToActive()
  })
})

function scrollToActive() {
  const elem = rootRef.value?.querySelector<HTMLElement>('.active')
  if (elem) {
    scroll.value?.scrollToElement(elem, 800, -40, 0)
  }
}

function refreshScroll() {
  scroll.value?.refresh()
}

function handleClick(item: PlayItem) {
  emit('click', item)
  if (props.showActive) {
    emit('update:active', item.vid)
  }
}
</script>

<style lang="scss">
.play-list-wrap {
  width: 100%;
  overflow: hidden;
  .play-list {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .item {
      position: relative;
      min-width: 54px;
      height: 54px;
      line-height: 54px;
      font-weight: bold;
      padding: 0 12px;
      background: #f6f8fa;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      .mark {
        position: absolute;
        top: 0;
        right: 0;
        height: 14px;
        line-height: 14px;
        font-size: 10px;
        font-weight: normal;
        padding-left: 3px;
        padding-right: 3px;
        border-bottom-left-radius: 4px;
      }
      &.active {
        color: #ec6a38;
        background: linear-gradient(to top right, #fcf0ea, #fef7f4);
      }
    }
    &:not(.is-series) {
      .item:not(:last-child) {
        margin-right: 12px;
      }
    }
    &.is-series {
      .item {
        width: 200px;
        text-align: left;
        &:not(:last-child) {
          margin-right: 12px;
        }
      }
    }
  }
  &--vertical {
    height: 100%;
    .play-list {
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .item {
        margin-bottom: 20px;
        &--empty {
          background: transparent;
        }
      }
      &:not(.is-series) {
        .item {
          margin-right: 6px !important;
        }
      }
      &.is-series {
        .item {
          width: 48%;
          &:nth-child(2n) {
            margin-right: 0;
          }
          &:nth-child(2n + 1) {
            margin-right: 6px;
          }
        }
      }
    }
  }
}
</style>
