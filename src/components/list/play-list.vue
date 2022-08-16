<template>
  <div ref="rootRef" class="play-list-wrap">
    <div class="play-list">
      <div v-for="(item, index) in list" :key="index" class="item">
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
  list: PlayItem[]
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const rootRef = ref<HTMLElement | null>(null)
const scroll = useScroll(
  rootRef,
  {
    scrollX: true,
    scrollY: false,
  },
  emit
)
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
  }
}
</style>
