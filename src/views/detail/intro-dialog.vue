<template>
  <transition name="van-fade">
    <div v-show="visible" class="dialog-wrap" @click="visible = false">
      <transition name="van-slide-up">
        <div
          v-show="visible"
          class="dialog-content"
          :style="detailStyle"
          @click.stop
        >
          <div class="header">
            {{ data.title }}
            <van-icon
              name="arrow-down"
              color="#858593"
              :size="px2vw(16)"
              @click="visible = false"
            />
          </div>
          <ScrollWrap ref="scrollRef" class="content-wrap">
            <div>
              <div
                v-if="data.detail_info"
                class="desc"
                v-html="data.detail_info"
              />
              <div
                v-if="data.area_name || data.year || data.main_genres"
                class="desc"
              >
                {{ data.area_name }}
                {{ data.year }}
                {{ data.main_genres?.replace(/,/g, '/') }}
              </div>
              <div
                v-if="data.cover_description"
                class="content van-hairline--top"
              >
                <div class="title">
                  简介
                </div>
                <div class="text">
                  {{ data.cover_description }}
                </div>
              </div>
            </div>
          </ScrollWrap>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import ScrollWrap from '@/components/scroll/scroll-wrap.vue'
import type { DetailIntro } from '@/types/detail'
import { px2vw, stopBodyScroll } from '@/utils/common'

interface Props {
  visible: boolean
  data: DetailIntro
  height?: string
}

const props = defineProps<Props>()
const visible = useVModel(props, 'visible')
const scrollRef = shallowRef<typeof ScrollWrap>()
const detailStyle = computed(() => {
  const height = props.height || 'calc(100vh - 56.25vw)'
  return {
    height,
  }
})

watch(visible, () => {
  if (visible.value) {
    stopBodyScroll(true)
    setTimeout(() => {
      scrollRef.value?.scroll?.refresh()
    }, 300)
  }
  else {
    stopBodyScroll(false)
  }
})
</script>

<style lang="scss" scoped>
.dialog-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #000, $alpha: 0.7);
  z-index: 999;
  .dialog-content {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 12px;
    max-height: 80%;
    background: #fff;
    overflow: hidden;
  }
  .header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    height: 48px;
    :deep(.van-icon) {
      line-height: 48px;
      padding: 0 12px;
      cursor: pointer;
    }
  }
  .content-wrap {
    flex: 1;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .desc {
    font-size: 14x;
    color: #848492;
    padding-bottom: 14px;
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
