import { ref, Ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylist, getDetail } from '@/api/detail'
import { DetailRes } from '@/types/detail'
import { PlayItem } from '@/types/search'
import { getDefDetail } from './default'

export default function useContent(cid: Ref<string>) {
  const route = useRoute()
  const router = useRouter()
  const detailData = ref<DetailRes>(getDefDetail())
  const active = ref('')
  const playlist = ref<PlayItem[]>([])
  const loading = ref(false)

  onMounted(async () => {
    if (!route.query.url) {
      toHome()
    }

    loading.value = true
    Promise.all([getDetail(route.query.url as string), getPlaylist(cid.value)])
      .then(([detail, list]) => {
        detailData.value = detail
        playlist.value = list
        active.value = detailData.value.videoInfo.vid
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  })

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

  return {
    detailData,
    playlist,
    active,
    loading,
    toHome,
    handleClick,
  }
}
