<template>
  <div v-if="loading" class="skeleton-wrap">
    <van-skeleton
      v-for="item in num"
      :key="item"
      class="skeleton"
      title
      round
      avatar
      avatar-size="90"
      :row="7"
    />
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
interface Props {
  num?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  num: 1,
  loading: false,
})
</script>

<style lang="scss" scoped>
.skeleton-wrap {
  .skeleton {
    &:first-child {
      padding-top: 12px;
    }
    &:not(:last-child) {
      padding-bottom: 50px;
    }
  }
}
</style>
