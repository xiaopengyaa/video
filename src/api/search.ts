import http from '@/utils/http'
import { SearchReq, SearchRes } from '@/types/search'

export async function search(params: SearchReq) {
  const data = await http.get<SearchRes>('/search', params)
  return data
}
