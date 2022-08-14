import { BaseType } from '@/types/base'

export interface SearchReq extends BaseType {
  keyword: string
}

export interface PlayItem {
  href: string
  num: string
  mark: string
}

export interface SearchItem {
  image: string
  mark: string
  title: string
  sub: string[]
  desc: string
  playlist: PlayItem[]
}

export interface SearchRes {
  list: SearchItem[]
  relateList: unknown[]
}
