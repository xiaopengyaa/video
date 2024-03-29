import { Site } from './enum'
import { SearchItem } from './search'

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
  area_name: string
  cover_description: string
  detail_info: string
  episode_all: string
  hotval: string
  main_genres: string
  title: string
  update_notify_desc: string
  year: string
}

export interface VideoInfo {
  c_covers: string
  c_title_output: string
  pioneer_tag: string
  title: string
  type: number
  type_name: string
  vid: string
}

export interface TopItem {
  id: string
  pic: string
  secondTitle: string
  timelong: string
  title: string
}
