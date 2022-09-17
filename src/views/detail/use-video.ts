import { Site } from '@/types/enum'
import { Ref } from 'vue'

export default function useVideo(playUrl: Ref<string>) {
  const route = useRoute()
  const cid = ref('')
  const series = ref('')
  const site = ref<Site>(Site.qq)

  const backTop = computed(() => {
    const urls = ['okjx.cc']
    const flag = urls.some((url) => {
      return playUrl.value.includes(url)
    })
    return flag ? '50px' : '20px'
  })

  watchEffect(() => {
    cid.value = route.query.cid as string
    series.value = route.query.series as string
    site.value = route.query.site as Site
  })

  return {
    cid,
    series,
    site,
    backTop,
  }
}
