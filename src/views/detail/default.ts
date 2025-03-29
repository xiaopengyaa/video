import type { DetailRes } from '@/types/detail'

export function getDefDetail(): DetailRes {
  return {
    introduction: {
      area: '',
      desc: '',
      detailInfo: '',
      kinds: '',
      title: '',
      update: '',
      year: '',
    },
    topList: [],
    videoInfo: {
      vid: '',
      title: '',
    },
    tabs: [],
  }
}
