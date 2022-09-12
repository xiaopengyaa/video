import { Site } from '@/types/enum'

export default function useVideo() {
  const route = useRoute()
  const playUrl = ref('')
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
    // playUrl.value = `https://m2090.com/?url=${route.query.url}`
    playUrl.value = `https://okjx.cc/?url=${route.query.url}`
    // playUrl.value = `https://jx.bozrc.com:4433/player/?url=${route.query.url}`
    cid.value = route.query.cid as string
    series.value = route.query.series as string
    site.value = route.query.site as Site
  })

  return {
    playUrl,
    cid,
    series,
    site,
    backTop,
  }
}
