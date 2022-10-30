import { Site } from '@/types/enum'
import { Ref } from 'vue'

export default function useVideo(playUrl: Ref<string>) {
  const route = useRoute()
  const cid = ref('')
  const site = ref<Site>(Site.qq)

  watchEffect(() => {
    cid.value = route.query.cid as string
    site.value = route.query.site as Site
  })

  return {
    cid,
    site,
  }
}
