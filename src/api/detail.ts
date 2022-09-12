import http from '@/utils/http'
import { PlayItem } from '@/types/search'
import { DetailReq, DetailRes } from '@/types/detail'

export async function getDetail(data: DetailReq) {
  const res = await http.get<DetailRes>('/detail/getDetail', data)
  return res
}

export async function getPlaylist(data: DetailReq) {
  const res = await http.get<PlayItem[]>('/detail/getPlaylist', data)
  return res
}
