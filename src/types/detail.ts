export interface DetailRes {
  introduction: DetailIntro
  topList: TopItem[]
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

export interface TopItem {
  id: string
  pic: string
  secondTitle: string
  timelong: string
  title: string
}
