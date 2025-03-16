import axios from 'axios'
import http from '@/utils/http'
import { PlayItem } from '@/types/search'
import { DetailReq, DetailRes } from '@/types/detail'
import { ResData } from '@/types/base'

export async function getDetail(data: DetailReq) {
  const res = await http.get<DetailRes>('/detail/getDetail', data)
  return res
}

export async function getPlaylist(data: DetailReq) {
  const res = await http.post<PlayItem[]>('/detail/getPlaylist', data)
  return res
}

export async function getVurl(url: string) {
  const res = await axios.get<ResData<string>>(
    import.meta.env.VITE_APP_BASE_URL + '/detail/getVurl',
    {
      params: { url },
    }
  )
  return res.data
}
