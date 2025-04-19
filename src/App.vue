<template>
  <van-config-provider class="config-provider" :theme="mode">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          :is="Component"
          v-if="route.meta.keepAlive"
          :key="route.name"
        />
      </keep-alive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.name" />
    </router-view>
  </van-config-provider>
</template>

<script setup lang="ts">
import { isDark } from './composables/dark'
import { useLockScroll } from './composables/base'

useLockScroll()

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
</script>

<style lang="scss" scoped>
.config-provider {
  height: 100%;
}
</style>
