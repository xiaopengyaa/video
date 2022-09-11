import { Ref, ref } from 'vue'
import { RecommendItem } from '@/types/search'
import { recommend } from '@/api/search'

const storeMap: Record<string, RecommendItem[]> = {}

export default function useRecommend(keyword: Ref<string>) {
  const recommendList = ref<RecommendItem[]>([])
  const isFocus = ref(false)
  const getRecommend = useDebounceFn(async (keyword: string) => {
    recommendList.value = await getRecommendList(keyword)
  }, 200)

  watch(keyword, () => {
    if (!keyword.value || !isFocus.value) {
      recommendList.value = []
      return
    }
    getRecommend(keyword.value.trim())
  })

  return {
    recommendList,
    isFocus,
  }
}

async function getRecommendList(keyword: string) {
  if (storeMap[keyword]) {
    return storeMap[keyword]
  } else {
    const list = await recommend({
      keyword,
      site: 'qq',
    })
    storeMap[keyword] = list
    return list
  }
}
