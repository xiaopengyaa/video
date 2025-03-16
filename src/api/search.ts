import http from '@/utils/http'
import type { RecommendItem, SearchReq, SearchRes } from '@/types/search'

export async function search(params: SearchReq) {
  const data = await http.get<SearchRes>('/search', params)
  return data
}

export async function recommend(params: SearchReq) {
  const data = await http.get<RecommendItem[]>('/search/recommend', params)
  return data
}
