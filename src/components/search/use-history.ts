import { SEARCH_KEY } from '@/utils/constant'
import { useStorage } from '@vueuse/core'

const searchList = useStorage<string[]>(SEARCH_KEY, [])

export default function useHistory() {
  function delHistory() {
    searchList.value = []
  }

  function addHistory(keyword: string) {
    if (!keyword) {
      return
    }
    if (searchList.value.includes(keyword)) {
      const index = searchList.value.findIndex((value) => {
        return value === keyword
      })
      searchList.value.splice(index, 1)
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
