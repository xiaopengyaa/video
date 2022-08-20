import http from '@/utils/http'
import { PlayItem } from '@/types/search'
import { DetailRes } from '@/types/detail'

export async function getDetail(url: string) {
  const data = await http.get<DetailRes>('/detail/getDetail', {
    url,
  })
  return data
}

export async function getPlaylist() {
  const data = await http.get<PlayItem[]>('/detail/getPlaylist')
  return data
}
