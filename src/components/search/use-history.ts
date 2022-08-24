import { SEARCH_KEY } from '@/utils/constant'
import { useStorage } from '@vueuse/core'

const searchList = useStorage<string[]>(SEARCH_KEY, [])

export default function useHistory() {
  function delHistory() {
    searchList.value = []
  }

  function addHistory(keyword: string) {
    if (!keyword || searchList.value.includes(keyword)) {
      return
    }

    searchList.value.unshift(keyword)
    searchList.value = searchList.value.slice(0, 10)
  }

  return {
    searchList,
    addHistory,
    delHistory,
  }
}
