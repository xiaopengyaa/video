<template>
  <div class="search-history">
    <div class="title">
      历史搜索
      <van-icon name="delete-o" size="20" @click="delHistory" />
    </div>
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="handleClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useHistory from './use-history'

interface Emits {
  (e: 'click', value: string): void
}
interface Props {
  list: string[]
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()

const { delHistory } = useHistory()

function handleClick(item: string) {
  emit('click', item)
}
</script>

<style lang="scss" scoped>
.search-history {
  padding: 16px 12px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #848492;
    margin-bottom: 2px;
  }
  .item {
    display: inline-block;
    background: #f6f8fa;
    padding: 6px 10px;
    margin-right: 8px;
    margin-top: 10px;
    border-radius: 2px;
  }
}
</style>
