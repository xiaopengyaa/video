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

  onMounted(async () => {
    if (!route.query.url) {
      toHome()
    }
    detailData.value = await getDetail(route.query.url as string)
    active.value = detailData.value.videoInfo.vid
    playlist.value = await getPlaylist(cid.value)
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
    toHome,
    handleClick,
  }
}
