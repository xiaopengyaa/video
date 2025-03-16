import type { Ref } from 'vue'
import { ref } from 'vue'
import { search } from '@/api/search'
import type { SearchRes } from '@/types/search'
import { Site } from '@/types/enum'
import useHistory from './use-history'

export default function useSearch(visible: Ref<boolean>) {
  const keyword = ref('')
  const loading = ref(false)
  const isEmpty = ref(false)
  const searchData = ref<SearchRes>(getDefSearch())
  const { addHistory } = useHistory()

  async function onSearch(keyword: string) {
    try {
      loading.value = true
      isEmpty.value = false
      addHistory(keyword)
      searchData.value = await search({ keyword, site: Site.qq })

      if (searchData.value.list.length === 0 && searchData.value.relateList.length === 0) {
        isEmpty.value = true
      }
    }
    catch (e) {
      isEmpty.value = true
    }
    loading.value = false
  }
  const onCancel = () => {
    visible.value = false
  }

  function getDefSearch(): SearchRes {
    return {
      list: [],
      relateList: [],
    }
  }
  return {
    keyword,
    loading,
    isEmpty,
    searchData,
    onSearch,
    onCancel,
    getDefSearch,
  }
}
