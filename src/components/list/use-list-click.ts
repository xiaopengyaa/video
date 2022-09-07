import { PlayItem, SearchItem } from '@/types/search'

interface DetailParam {
  href: string
  cid: string
  series: string
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
    })
  }

  function playClick(playItem: PlayItem, item: SearchItem) {
    toDetail({
      href: playItem.href,
      cid: item.cid,
      series: item.series,
    })
  }

  function toDetail({ href, cid, series }: DetailParam) {
    if (!href) {
      return
    }
    router.push({
      path: '/detail',
      query: {
        url: href,
        cid,
        series,
      },
    })
  }

  return {
    btnClick,
    playClick,
    toDetail,
  }
}
