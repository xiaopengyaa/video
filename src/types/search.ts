import { BaseType } from '@/types/base'

export interface SearchReq extends BaseType {
  keyword: string
}

export interface PlayItem {
  vid: string
  cid: string
  href: string
  num: string
  mark: string
}

export interface SearchItem {
  cid: string
  image: string
  mark: string
  title: string
  href: string
  sub: string[]
  desc: string
  playlist: PlayItem[]
}

export interface SearchRes {
  list: SearchItem[]
  relateList: unknown[]
}
