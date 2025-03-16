import type { PlayItem, SearchItem } from '@/types/search'
import { Site } from '@/types/enum'

interface DetailParam {
  href: string
  cid: string
  site: Site
  queryTxt: string
}

export default function useListClick() {
  const router = useRouter()

  function btnClick(item: SearchItem, queryTxt: string) {
    let href = item.href
    if (item.playlist.length) {
      href = item.playlist[0].href
    }
    else if (item.btnlist.length) {
      href = item.btnlist[0].href
    }

    toDetail({
      href,
      cid: item.cid,
      site: item.site,
      queryTxt,
    })
  }

  function playClick(playItem: PlayItem, item: SearchItem, queryTxt: string) {
    let href = playItem.href
    if (!playItem.href) {
      href = item.playlist[0].href
    }
    toDetail({
      href,
      cid: item.cid,
      site: item.site,
      queryTxt,
    })
  }

  function toDetail({ href, cid, site = Site.qq, queryTxt }: DetailParam) {
    if (!href) {
      return
    }
    router.push({
      path: '/detail',
      query: {
        url: href,
        cid,
        site,
        queryTxt,
      },
    })
  }

  return {
    btnClick,
    playClick,
    toDetail,
  }
}
