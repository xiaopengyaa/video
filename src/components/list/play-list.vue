<template>
  <div ref="rootRef" class="play-list-wrap">
    <div class="play-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :class="{
          active: showActive && active === item.num,
        }"
        @click="handleClick(item)"
      >
        {{ item.num }}
        <div v-if="item.mark" class="mark">
          <van-image :src="item.mark" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayItem } from '@/types/search'
import useScroll from '@/components/scroll/use-scroll'

interface Props {
  active?: string
  showActive?: boolean
  list: PlayItem[]
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
  (event: 'click', item: PlayItem): void
  (event: 'update:active', num: string): void
}

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  active: '',
  showActive: false,
})

const rootRef = ref<HTMLElement | null>(null)
const scroll = useScroll(
  rootRef,
  {
    click: true,
    scrollX: true,
    scrollY: false,
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

function handleClick(item: PlayItem) {
  emit('click', item)
  if (props.showActive) {
    emit('update:active', item.num)
  }
}
</script>

<style lang="scss">
.play-list-wrap {
  width: 100%;
  overflow: hidden;
}
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
      display: flex;
    }
    &.active {
      background: linear-gradient(to top right, #fcf0ea, #fef7f4);
    }
  }
}
</style>
