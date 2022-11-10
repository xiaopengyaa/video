import { Site } from '@/types/enum'

export default function useVideo() {
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
