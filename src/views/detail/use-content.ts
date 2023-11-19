import { ref, Ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylist, getDetail } from '@/api/detail'
import { DetailReq, DetailRes } from '@/types/detail'
import { PlayItem, SearchItem } from '@/types/search'
import { Site } from '@/types/enum'
import { getDefDetail } from './default'
import useListClick from '@/components/list/use-list-click'
import { restoreHtmlText, setTitle } from '@/utils/common'

export default function useContent(cid: Ref<string>, site: Ref<Site>) {
  const route = useRoute()
  const router = useRouter()
  const title = useTitle()
  const detailData = ref<DetailRes>(getDefDetail())
  const active = ref('')
  const playlist = ref<PlayItem[]>([])
  const loading = ref(false)
  const isEmpty = ref(false)

  const queryTxt = computed<string>(() => {
    return (route.query.queryTxt as string) || ''
  })
  const { btnClick } = useListClick()

  watch(cid, () => {
    initDetail()
  })

  onMounted(async () => {
    initDetail()
  })

  async function initDetail() {
    if (!route.query.url) {
      toHome()
      return
    }

    isEmpty.value = false
    loading.value = true
    const detailReq: DetailReq = {
      url: route.query.url as string,
      cid: cid.value,
      site: site.value,
      queryTxt: queryTxt.value,
      tabs: [],
    }

    try {
      const detail = await getDetail(detailReq)
      detailReq.tabs = detail.tabs
      const list = await getPlaylist(detailReq)

      detailData.value = detail
      playlist.value = list
      title.value = setTitle(detailData.value.introduction.title)
      if (detailData.value.videoInfo.vid) {
        active.value = detailData.value.videoInfo.vid
      } else if (list.length) {
        active.value = list[0].vid
      }

      loading.value = false
      if (list.length === 0) {
        isEmpty.value = true
      }
    } catch {
      loading.value = false
      isEmpty.value = true
    }
  }

  function toHome() {
    title.value = setTitle('')
    router.push('/')
  }

  function handleClick(item: PlayItem) {
    router.replace({
      path: '/detail',
      query: {
        ...route.query,
        url: item.href,
      },
    })
  }

  function relateClick(item: SearchItem) {
    if (item.cid === cid.value && playlist.value.length) {
      active.value = playlist.value[0].vid
    }
    btnClick(item, restoreHtmlText(item.title))
  }

  return {
    detailData,
    playlist,
    active,
    loading,
    isEmpty,
    toHome,
    handleClick,
    relateClick,
  }
}
