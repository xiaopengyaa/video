import { Ref, ref } from 'vue'
import { search } from '@/api/search'
import { SearchRes } from '@/types/search'
import useHistory from './use-history'

export default function useSearch(visible: Ref<boolean>) {
  const keyword = ref('')
  const loading = ref(false)
  const searchData = ref<SearchRes>(getDefSearch())
  const { addHistory } = useHistory()

  async function onSearch(keyword: string) {
    try {
      loading.value = true
      addHistory(keyword)
      searchData.value = await search({ keyword, type: 'tx' })
    } catch (e) {
      console.log(e)
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
    searchData,
    onSearch,
    onCancel,
    getDefSearch,
  }
}
