import { Site } from '@/types/enum'
import { Ref } from 'vue'

export default function useVideo(playUrl: Ref<string>) {
  const route = useRoute()
  const cid = ref('')
  const site = ref<Site>(Site.qq)

  const hideBack = computed(() => {
    const urls = [
      'jx.aidouer.net',
      'jx.m3u8.tv/jiexi',
      'jx.4kdv.com',
      'jx.ergan.top',
    ]
    return urls.some((url) => {
      return playUrl.value.includes(url)
    })
  })

  const backTop = computed(() => {
    const urls = ['okjx.cc']
    const flag = urls.some((url) => {
      return playUrl.value.includes(url)
    })
    return flag ? '50px' : '20px'
  })

  watchEffect(() => {
    cid.value = route.query.cid as string
    site.value = route.query.site as Site
  })

  return {
    cid,
    site,
    backTop,
    hideBack,
  }
}
