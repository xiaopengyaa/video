import type { BaseType } from '@/types/base'
import type { Site } from '@/types/enum'

export interface SearchReq extends BaseType {
  keyword: string
}

export interface PlayItem {
  vid: string
  cid: string
  href: string
  text: string
  mark: MarkItem | null
}

export interface MarkItem {
  backgroundColor: string
  fontColor: string
  text: string
}

export interface SearchItem {
  site: Site
  cid: string
  image: string
  imageInfo: string
  mark: MarkItem | null
  title: string
  href: string
  sub: string[]
  desc: string
  playlist: PlayItem[]
  btnlist: PlayItem[]
}

export interface SearchRes {
  list: SearchItem[]
  relateList: SearchItem[]
}

export interface RecommendItem {
  title: string
  imgUrl: string
  videoType: number
  typeName: string
}
