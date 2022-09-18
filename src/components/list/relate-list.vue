<template>
  <div ref="rootRef" class="relate-list-wrap">
    <div class="relate-list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="handleClick(item)"
      >
        <van-image
          radius="4"
          lazy-load
          :width="px2vw(width)"
          :height="px2vw(height)"
          :src="item.image"
        />
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
  width?: number
  height?: number
}

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
  (event: 'click', item: SearchItem): void
}

const HEIGHT = 126
const IMG_INFO_TOP = 106
const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  width: 90,
  height: 126,
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

defineExpose({
  scroll,
})

const itemWidth = computed(() => {
  return `${px2vw(props.width)}px`
})
const imageInfoTop = computed(() => {
  return `${px2vw(IMG_INFO_TOP - HEIGHT + props.height)}px`
})

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
    width: v-bind(itemWidth);
    cursor: pointer;
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
    .image-info-wrap {
      top: v-bind(imageInfoTop);
    }
  }
}
</style>
