import { ref, Ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylist, getDetail } from '@/api/detail'
import { DetailRes } from '@/types/detail'
import { PlayItem, SearchItem } from '@/types/search'
import { getDefDetail } from './default'
import useListClick from '@/components/list/use-list-click'

export default function useContent(cid: Ref<string>) {
  const route = useRoute()
  const router = useRouter()
  const detailData = ref<DetailRes>(getDefDetail())
  const active = ref('')
  const playlist = ref<PlayItem[]>([])
  const loading = ref(false)
  const isEmpty = ref(false)
  const { btnClick } = useListClick()

  watch(cid, () => {
    initDetail()
  })

  onMounted(async () => {
    initDetail()
  })

  function initDetail() {
    if (!route.query.url) {
      toHome()
      return
    }

    isEmpty.value = false
    loading.value = true
    Promise.all([getDetail(route.query.url as string), getPlaylist(cid.value)])
      .then(([detail, list]) => {
        detailData.value = detail
        playlist.value = list
        if (detailData.value.videoInfo.vid) {
          active.value = detailData.value.videoInfo.vid
        } else if (list.length) {
          active.value = list[0].vid
        }

        loading.value = false
        if (list.length === 0) {
          isEmpty.value = true
        }
      })
      .catch(() => {
        loading.value = false
        isEmpty.value = true
      })
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
      },
    })
  }

  function relateClick(item: SearchItem) {
    if (item.cid === cid.value && playlist.value.length) {
      active.value = playlist.value[0].vid
    }
    btnClick(item)
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
