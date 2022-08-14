import { Ref, ref, reactive } from 'vue'
import { search } from '@/api/search'
import { SearchRes } from '@/types/search'

export default function useSearch(visible: Ref<boolean>) {
  const keyword = ref('')
  const searchData = ref<SearchRes>({
    list: [],
    relateList: [],
  })

  const onSearch = async (keyword: string) => {
    const data = await search({ keyword, type: 'tx' })
    searchData.value = data
  }
  const onCancel = () => {
    visible.value = false
  }
  return {
    keyword,
    searchData,
    onSearch,
    onCancel,
  }
}
