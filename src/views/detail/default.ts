import { DetailRes } from '@/types/detail'

export function getDefDetail(): DetailRes {
  return {
    introduction: {
      area_name: '',
      cover_description: '',
      detail_info: '',
      episode_all: '',
      hotval: '',
      main_genres: '',
      title: '',
      update_notify_desc: '',
      year: '',
    },
    topList: [],
    videoInfo: {
      c_covers: '',
      c_title_output: '',
      pioneer_tag: '',
      title: '',
      type: -1,
      type_name: '',
      vid: '',
    },
  }
}
