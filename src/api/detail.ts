import axios from 'axios'
import http from '@/utils/http'
import type { PlayItem } from '@/types/search'
import type { DetailReq, DetailRes } from '@/types/detail'
import type { ResData } from '@/types/base'
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
  const res = await axios.get<ResData<string>>(
    `${import.meta.env.VITE_APP_BASE_URL}/detail/getVurl`,
    {
      params: { url, type },
    },
  )
  return res.data
}
