<template>
  <teleport to="body">
    <transition name="van-fade">
      <div v-show="searchVisible" class="search-wrap">
        <form action="/">
          <transition name="slide-fade">
            <van-search
              v-show="searchVisible"
              v-model="keyword"
              show-action
              placeholder="请输入视频名称"
              autofocus
              @search="onSearch"
            >
              <template #action>
                <div @click="onCancel">取消</div>
              </template>
            </van-search>
          </transition>
        </form>
        <video-list class="search-list" :list="searchData.list" />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import VideoList from '@/components/list/video-list.vue'
import useSearch from './use-search'

interface Props {
  visible: boolean
}
interface Emits {
  (e: 'update:visible', value: boolean): void
}

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const searchVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const { keyword, searchData, onCancel, onSearch } = useSearch(searchVisible)
</script>

<style lang="scss">
.search-wrap {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 100;
}
.search-list {
  flex: 1;
  overflow: auto;
}
</style>
