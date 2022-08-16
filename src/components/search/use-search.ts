import { Ref, ref } from 'vue'
import { search } from '@/api/search'
import { SearchRes } from '@/types/search'

export default function useSearch(visible: Ref<boolean>) {
  const keyword = ref('')
  const loading = ref(false)
  const searchData = ref<SearchRes>({
    list: [],
    relateList: [],
  })

  const onSearch = async (keyword: string) => {
    try {
      loading.value = true
      searchData.value = await search({ keyword, type: 'tx' })
    } catch (e) {
      console.log(e)
    }
    loading.value = false
  }
  const onCancel = () => {
    visible.value = false
  }
  return {
    keyword,
    loading,
    searchData,
    onSearch,
    onCancel,
  }
}
