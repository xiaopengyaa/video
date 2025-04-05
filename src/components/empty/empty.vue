<template>
  <van-empty
    class="custom-empty"
    :description="EMPTY_DESCRIPTION"
    :image-size="EMPTY_IMAGE_SIZE"
    :image="getImageUrl(EMPTY_IMAGE)"
  />
</template>

<script setup lang="ts">
import { EMPTY_DESCRIPTION, EMPTY_IMAGE, EMPTY_IMAGE_SIZE } from '@/utils/constant'
import { getImageUrl } from '@/utils/common'
</script>

<style  lang="scss" scoped>
.custom-empty {
  height: 100%;
  overflow: hidden;
  :deep(.van-empty__image) {
    margin-top: -30px;
  }
}
</style>
