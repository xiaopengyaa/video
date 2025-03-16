<template>
  <div v-if="debounced" class="loading-skeleton">
    <div class="text loading-skeleton--animate">
      xiaopengyaa视频
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { LOADING_DELAY } from '@/utils/constant'

interface Props {
  loading: boolean
}

const props = defineProps<Props>()
const debounced = refDebounced(
  computed(() => props.loading),
  LOADING_DELAY,
)
</script>

<style lang="scss" scoped>
.loading-skeleton {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: bold;
  overflow: hidden;
  .text {
    background-image: linear-gradient(45deg, #fff, #dadee1);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.loading-skeleton--animate {
  animation: skeleton-gradient 2.5s linear infinite;
}

@keyframes skeleton-gradient {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 480px 0;
  }
}
</style>
