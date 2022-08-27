<template>
  <div ref="rootRef" class="relate-list-wrap">
    <div class="relate-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="handleClick(item)"
      >
        <van-image :width="px2vw(90)" radius="4" :src="item.image" />
        <div class="title van-multi-ellipsis--l2" v-html="item.title" />
        <div v-if="item.mark" class="mark">
          <van-image :width="px2vw(37)" :src="item.mark" />
        </div>
        <div class="image-info-wrap">
          <div class="image-info van-ellipsis">{{ item.imageInfo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchItem } from '@/types/search'
import useScroll from '@/components/scroll/use-scroll'
import { px2vw } from '@/utils/common'

interface Props {
  list: SearchItem[]
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
  (event: 'click', item: SearchItem): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

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

function handleClick(item: SearchItem) {
  emit('click', item)
}
</script>

<style lang="scss">
.relate-list-wrap {
  width: 100%;
  overflow: hidden;
}
.relate-list {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  .item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 90px;
    &:not(:last-child) {
      margin-right: 8px;
    }
    .title {
      height: 32px;
      font-size: 14px;
      margin-top: 5px;
      .main {
        color: #ec6a38;
      }
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
