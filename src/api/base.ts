import http from '@/utils/http'
import type { FeedbackParams, FlagResponse } from '@/types/base'

export async function submitFeedback(params: FeedbackParams) {
  const data = await http.post<FlagResponse>('/feedback/submit', params)
  return data
}
