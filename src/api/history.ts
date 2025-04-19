import http from '@/utils/http'
import type { FlagMsg, PageParams, PageRes } from '@/types/base'
import type { HistoryItem, UpdateHistoryParams } from '@/types/history'

export async function getHistoryList(params: PageParams) {
  const data = await http.get<PageRes<HistoryItem>>('/history/list', params)
  return data
}

export async function addHistory(params: UpdateHistoryParams) {
  const data = await http.post<FlagMsg>('/history/add', params)
  return data
}

export async function updateHistory(params: UpdateHistoryParams) {
  const data = await http.post<FlagMsg>('/history/update', params)
  return data
}

export async function deleteHistory(id: string) {
  const data = await http.post<FlagMsg>('/history/delete', { id })
  return data
}

export async function clearHistory() {
  const data = await http.post<FlagMsg>('/history/clear')
  return data
}
