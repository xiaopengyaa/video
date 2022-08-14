import { Code } from '@/types/enum'

export interface ResData<T> {
  code: Code
  result: T
}

export interface BaseType {
  type: 'tx' | 'aqy'
}
