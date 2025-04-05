import type { Ref } from 'vue'
import { ref } from 'vue'
import type { RecommendItem } from '@/types/search'
import { Site } from '@/types/enum'
import { recommend } from '@/api/search'

const storeMap: Record<string, RecommendItem[]> = {}

export default function useRecommend(keyword: Ref<string>) {
  const list = ref<RecommendItem[]>([])
  const isFocus = ref(false)
  const getRecommend = useDebounceFn(async (keyword: string) => {
    list.value = await getRecommendList(keyword)
  }, 200)

  watch(keyword, () => {
    if (!keyword.value || !isFocus.value) {
      list.value = []
      return
    }
    getRecommend(keyword.value.trim())
  })

  return {
    list,
    isFocus,
  }
}

async function getRecommendList(keyword: string) {
  if (storeMap[keyword]) {
    return storeMap[keyword]
  }
  else {
    const list = await recommend({
      keyword,
      site: Site.qq,
    })
    storeMap[keyword] = list
    return list
  }
}
