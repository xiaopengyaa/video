import type { PlayItem, SearchItem } from '@/types/search'
import { Site } from '@/types/enum'

interface DetailParam {
  href: string
  site: Site
  progress?: number
  back?: string
}

export default function useListClick() {
  const router = useRouter()

  function btnClick(item: SearchItem) {
    let href = item.href
    if (item.playlist.length) {
      href = item.playlist[0].href
    }
    else if (item.btnlist.length) {
      href = item.btnlist[0].href
    }

    toDetail({
      href,
      site: item.site,
    })
  }

  function playClick(playItem: PlayItem, item: SearchItem) {
    let href = playItem.href
    if (!playItem.href) {
      href = item.playlist[0].href
    }
    toDetail({
      href,
      site: item.site,
    })
  }

  function toDetail({ href, site = Site.qq, progress, back }: DetailParam) {
    if (!href) {
      return
    }
    router.push({
      path: '/detail',
      query: {
        url: href,
        site,
        progress,
        back,
      },
    })
  }

  return {
    btnClick,
    playClick,
    toDetail,
  }
}
