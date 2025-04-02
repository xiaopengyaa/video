import type { Code, Site } from '@/types/enum'

export interface ResData<T> {
  code: Code
  data: T
  message: string
}

export interface BaseType {
  site: Site
}

export interface FlagMsg {
  flag: boolean
  message: string
}

export type FlagResponse<T = undefined> = { flag: true, message: string, data: T } | { flag: false, message: string }
