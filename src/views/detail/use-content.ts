import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDetail, getPlaylist } from '@/api/detail'
import type { DetailReq, DetailRes, PlaylistReq } from '@/types/detail'
import type { PlayItem, SearchItem } from '@/types/search'
import type { Site } from '@/types/enum'
import { getDefDetail } from './default'
import useListClick from '@/components/list/use-list-click'
import { setTitle } from '@/utils/common'

export default function useContent(site: Ref<Site>) {
  const route = useRoute()
  const router = useRouter()
  const title = useTitle()
  const detailData = ref<DetailRes>(getDefDetail())
  const cid = ref('')
  const vid = ref('')
  const playlist = ref<PlayItem[]>([])
  const loading = ref(false)
  const isEmpty = ref(false)
  const { btnClick } = useListClick()

  onMounted(() => {
    initDetail()
  })

  onActivated(() => {
    initDetail()
  })

  onDeactivated(() => {
    title.value = setTitle('')
  })

  async function initDetail() {
    if (!route.query.url) {
      toHome()
      return
    }

    const detailReq: DetailReq = {
      url: route.query.url as string,
      site: site.value,
    }
    const playlistReq: PlaylistReq = {
      ...detailReq,
      cid: '',
      tabs: [],
    }

    isEmpty.value = false
    loading.value = true

    try {
      // 获取详情
      const detail = await getDetail(detailReq)
      cid.value = detail.videoInfo.cid
      playlistReq.tabs = detail.tabs
      playlistReq.cid = cid.value

      // 获取播放列表
      const list = await getPlaylist(playlistReq)
      detailData.value = detail
      playlist.value = list
      title.value = setTitle(detailData.value.introduction.title)

      if (detailData.value.videoInfo.vid) {
        vid.value = detailData.value.videoInfo.vid
      }
      else if (list.length) {
        vid.value = list[0].vid
      }

      loading.value = false
      if (list.length === 0) {
        isEmpty.value = true
      }
    }
    catch {
      loading.value = false
      isEmpty.value = true
    }
  }

  function toHome() {
    router.push('/')
  }

  function handleClick(item: PlayItem) {
    router.replace({
      path: '/detail',
      query: {
        ...route.query,
        url: item.href,
        progress: undefined,
      },
    })
  }

  function relateClick(item: SearchItem) {
    initDetail()
    btnClick(item)
  }

  return {
    detailData,
    playlist,
    cid,
    vid,
    loading,
    isEmpty,
    toHome,
    handleClick,
    relateClick,
  }
}
