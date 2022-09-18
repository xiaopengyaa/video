<template>
  <div class="recommend-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="recommend-item van-hairline--bottom"
      @click="handleClick(item)"
    >
      <template v-if="item.imgUrl">
        <van-image
          :width="px2vw(36)"
          :height="px2vw(50)"
          :src="item.imgUrl"
          fit="cover"
          radius="6"
        />
        <div class="recommend-item__content">
          <div class="title van-ellipsis" v-html="item.title" />
          <van-tag class="tag" color="#e7f4fc" text-color="#5ea1e0">{{
            item.typeName
          }}</van-tag>
        </div>
      </template>
      <div
        v-else
        class="title title--no-img van-ellipsis"
        v-html="item.title"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecommendItem } from '@/types/search'
import { px2vw } from '@/utils/common'

interface Emits {
  (event: 'click', keyword: string): void
}

interface Props {
  list: RecommendItem[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClick(item: RecommendItem) {
  emit('click', item.title.replace(/<\/?[^>]+(>|$)/g, ''))
}
</script>

<style lang="scss" scoped>
.recommend-list {
  padding: 0 12px;
}
.recommend-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  .title {
    &--no-img {
      padding: 4px 0;
    }
    :deep(strong) {
      color: #ec6a38;
    }
  }
  &__content {
    flex: 1;
    margin-left: 10px;
    overflow: hidden;
    .tag {
      margin-top: 8px;
    }
  }
}
</style>
