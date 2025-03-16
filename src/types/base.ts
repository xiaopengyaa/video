import type { Code, Site } from '@/types/enum'

export interface ResData<T> {
  code: Code
  result: T
}

export interface BaseType {
  site: Site
}
