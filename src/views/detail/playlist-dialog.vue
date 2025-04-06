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
            剧集与更新
            <van-icon
              name="arrow-down"
              color="#858593"
              :size="px2vw(16)"
              @click="visible = false"
            />
          </div>
          <div v-if="desc" class="desc">
            {{ desc }}
          </div>
          <div class="content">
            <play-list
              ref="playlistRef"
              v-model:active="active"
              :list="list"
              direction="vertical"
              show-active
              @click="handleClick"
            />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import PlayList from '@/components/list/play-list.vue'
import type { PlayItem } from '@/types/search'
import { px2vw, stopBodyScroll } from '@/utils/common'

interface Props {
  visible: boolean
  list: PlayItem[]
  desc: string
  active: string
  height?: string
}

const props = defineProps<Props>()
const visible = useVModel(props, 'visible')
const active = useVModel(props, 'active')
const route = useRoute()
const router = useRouter()
const playlistRef = useTemplateRef<InstanceType<typeof PlayList>>('playlistRef')

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
      playlistRef.value.refreshScroll()
      playlistRef.value.scrollToActive()
    }, 300)
  }
  else {
    stopBodyScroll(false)
  }
})

function handleClick(item: PlayItem) {
  router.replace({
    path: '/detail',
    query: {
      ...route.query,
      url: item.href,
      progress: undefined,
    },
  })
}
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
  .desc {
    font-size: 14x;
    color: #848492;
    padding-bottom: 18px;
  }
  .content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
