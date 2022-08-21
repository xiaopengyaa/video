import { SEARCH_KEY } from '@/utils/constant'
import { useStorage } from '@vueuse/core'

export default function useHistory() {
  const searchList = useStorage<string[]>(SEARCH_KEY, [])

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
