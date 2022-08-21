<template>
  <transition name="van-fade">
    <div v-show="searchVisible" class="search-wrap">
      <form ref="formRef" action="/" autocomplete="off">
        <transition name="slide-fade">
          <van-search
            v-show="searchVisible"
            ref="searchRef"
            v-model="keyword"
            class="van-hairline--bottom"
            show-action
            placeholder="请输入视频名称"
            @search="onSearch"
            @cancel="onCancel"
          />
        </transition>
      </form>
      <transition name="slide-fade">
        <search-history
          v-show="searchVisible && !keyword && searchList.length > 0"
          :list="searchList"
          @click="echoSearch"
        />
      </transition>
      <div v-show="keyword" class="search-list">
        <search-skeletom :loading="loading" :num="3">
          <scroll-wrap ref="scrollRef">
            <video-list :list="searchData.list" class="list" />
          </scroll-wrap>
        </search-skeletom>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import VideoList from '@/components/list/video-list.vue'
import useSearch from './use-search'
import useHistory from './use-history'
import ScrollWrap from '@/components/scroll/scroll-wrap.vue'
import SearchSkeletom from './search-skeleton.vue'
import type { SearchInstance } from 'vant'
import { useRect } from '@vant/use'

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

const scrollRef = ref<typeof ScrollWrap>()
const searchRef = ref<SearchInstance>()
const formRef = ref<HTMLElement>()
const formHeight = ref('0px')

const searchVisible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  },
})

const { searchList, addHistory } = useHistory()
const { keyword, loading, searchData, onCancel, onSearch, getDefSearch } =
  useSearch(searchVisible, addHistory)

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      setTimeout(() => {
        searchRef.value?.focus()
        const { height } = useRect(formRef)
        formHeight.value = `${height}px`
      }, 500)
    }
  }
)

watch(keyword, () => {
  // 清空数据
  searchData.value = getDefSearch()
})

function echoSearch(value: string) {
  keyword.value = value
  onSearch(value)
}
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
  position: absolute;
  top: v-bind(formHeight);
  left: 0;
  width: 100%;
  height: calc(100% - v-bind(formHeight));
  background: #fff;
  overflow: hidden;
  z-index: 10;
  > div {
    height: 100%;
    overflow: hidden;
  }
}
</style>
