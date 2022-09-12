import { BaseType } from '@/types/base'
import { Site } from '@/types/enum'

export interface SearchReq extends BaseType {
  keyword: string
}

export interface PlayItem {
  vid: string
  cid: string
  href: string
  text: string
  mark: string
}

export interface SearchItem {
  site: Site
  cid: string
  image: string
  imageInfo: string
  mark: string
  title: string
  href: string
  sub: string[]
  desc: string
  series: string
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
