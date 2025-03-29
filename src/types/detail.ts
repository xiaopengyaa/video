import type { Site } from './enum'
import type { SearchItem } from './search'

export interface PageTab {
  text: string
  isSelected: boolean
  pageContext: string
}

export interface DetailReq {
  url: string
  cid: string
  site: Site
  queryTxt: string
  tabs: PageTab[]
}

export interface DetailRes {
  introduction: DetailIntro
  topList: SearchItem[]
  videoInfo: VideoInfo
  tabs: PageTab[]
}

export interface DetailIntro {
  area: string
  desc: string
  detailInfo: string
  kinds: string
  title: string
  update: string
  year: string
}

export interface VideoInfo {
  vid: string
  title: string
}

export interface TopItem {
  id: string
  pic: string
  secondTitle: string
  timelong: string
  title: string
}
