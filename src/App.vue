<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="route.meta.keepAlive || ''">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts"></script>
