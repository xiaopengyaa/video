import type { Code, Site } from '@/types/enum'

export interface ResData<T> {
  code: Code
  data: T
  message: string
}

export interface BaseType {
  site: Site
}

export interface PageParams {
  page: number
  pageSize: number
}

export interface PageRes<T> {
  total: number
  list: T[]
}

export interface FlagMsg {
  flag: boolean
  message: string
}

export type FlagResponse<T = undefined> = { flag: true, message: string, data: T } | { flag: false, message: string }

export interface FeedbackParams {
  content: string
}
