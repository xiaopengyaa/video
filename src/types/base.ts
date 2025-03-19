import type { Code, Site } from '@/types/enum'

export interface ResData<T> {
  code: Code
  data: T
  message: string
}

export interface BaseType {
  site: Site
}
