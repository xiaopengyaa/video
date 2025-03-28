import http from '@/utils/http'
import type { PlayItem } from '@/types/search'
import type { DetailReq, DetailRes } from '@/types/detail'
import type { ParserType } from '@/types/enum'

export async function getDetail(data: DetailReq) {
  const res = await http.get<DetailRes>('/detail/getDetail', data)
  return res
}

export async function getPlaylist(data: DetailReq) {
  const res = await http.post<PlayItem[]>('/detail/getPlaylist', data)
  return res
}

export async function getVurl(url: string, type: ParserType) {
  const res = await http.get<string>('/detail/getVurl', { url, type }, {
    timeout: 0,
    headers: {
      'X-Cancel-Previous': '1',
      'X-Hide-Tips': '1',
    },
  })
  return res
}
