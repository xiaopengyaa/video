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
        'is-series': series === '1',
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
            'background-image': `url(${item.mark})`,
          }"
          class="mark"
        />
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
import { PlayItem } from '@/types/search'
import useScroll from '@/components/scroll/use-scroll'

interface Props {
  active?: string
  showActive?: boolean
  series?: string
  direction?: 'vertical' | 'horizontal'
  list: PlayItem[]
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
  (event: 'click', item: PlayItem): void
  (event: 'update:active', text: string): void
}

defineExpose({
  scrollToActive,
  refreshScroll,
})

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  active: '',
  showActive: false,
  series: '0',
  direction: 'horizontal',
})

const ITEM_ROW_LEN = 6
const rootRef = ref<HTMLElement | null>(null)
const playlistRef = ref<HTMLElement | null>(null)
const isVertical = computed(() => props.direction === 'vertical')
const emptyItemLen = computed(() => {
  return ITEM_ROW_LEN - (props.list.length % ITEM_ROW_LEN)
})

const scroll = useScroll(
  rootRef,
  {
    click: true,
    scrollX: !isVertical.value,
    scrollY: isVertical.value,
  },
  emit
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
      &:not(:last-child) {
        margin-right: 12px;
      }
      .mark {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 14px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: right;
      }
      &.active {
        color: #ec6a38;
        background: linear-gradient(to top right, #fcf0ea, #fef7f4);
      }
    }
    &.is-series {
      .item {
        width: 200px;
        text-align: left;
      }
    }
  }
  &--vertical {
    height: 100%;
    .play-list {
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        margin-bottom: 20px;
        &:not(:last-child) {
          margin-right: 6px;
        }
        &--empty {
          background: transparent;
        }
      }
    }
  }
}
</style>
