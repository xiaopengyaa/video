<template>
  <van-action-sheet
    v-model:show="visible"
    class="detail-intro"
    close-icon="arrow-down"
    :style="detailStyle"
    :title="data.title"
    :round="false"
    :duration="0.2"
  >
    <div ref="rootRef" class="scroll-wrap">
      <div class="content-wrap">
        <div class="desc" v-html="data.detail_info" />
        <div class="desc">
          {{ data.area_name }}
          {{ data.year }}
          {{ data.main_genres?.replace(/,/g, '/') }}
        </div>
        <div class="content van-hairline--top">
          <div class="title">简介</div>
          <div class="text">
            {{ data.cover_description }}
          </div>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
import { DetailIntro } from '@/types/detail'

interface Props {
  visible: boolean
  data: DetailIntro
  height?: string
}

const props = defineProps<Props>()
const visible = useVModel(props, 'visible')
const detailStyle = computed(() => {
  const height = props.height || 'calc(100vh - 56.25vw)'
  return {
    height,
  }
})
</script>

<style lang="scss">
.detail-intro {
  color: #000;

  .van-action-sheet__header {
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    padding: 0 12px;
  }

  .van-action-sheet__close {
    font-size: 16px;
    color: #858593;
  }

  .van-action-sheet__content {
    padding: 0 12px;
    margin-bottom: 12px;
  }

  .desc {
    font-size: 14x;
    color: #848492;
    margin-bottom: 14px;
  }
  .content {
    padding-top: 18px;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
    .text {
      margin-top: 10px;
      line-height: 28px;
    }
  }
}
</style>
