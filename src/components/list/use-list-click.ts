import { PlayItem, SearchItem } from '@/types/search'
import { Site } from '@/types/enum'

interface DetailParam {
  href: string
  cid: string
  series: string
  site: Site
}

export default function useListClick() {
  const router = useRouter()

  function btnClick(item: SearchItem) {
    let href = item.href
    if (item.playlist.length) {
      href = item.playlist[0].href
    } else if (item.btnlist.length) {
      href = item.btnlist[0].href
    }

    toDetail({
      href,
      cid: item.cid,
      series: item.series,
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
      cid: item.cid,
      series: item.series,
      site: item.site,
    })
  }

  function toDetail({ href, cid, series, site = Site.qq }: DetailParam) {
    if (!href) {
      return
    }
    router.push({
      path: '/detail',
      query: {
        url: href,
        cid,
        series,
        site,
      },
    })
  }

  return {
    btnClick,
    playClick,
    toDetail,
  }
}
