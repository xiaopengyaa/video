import type { ShallowRef } from 'vue'
import { Site } from '@/types/enum'
import { getVurl } from '@/api/detail'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import flvjs from 'flv.js'
import { getImageUrl, getSvgUrl } from '@/utils/common'

const NOT_SUPPORTED = '播放失败，有问题请联系最帅的那位。'
Artplayer.SETTING_WIDTH = 180
Artplayer.SETTING_ITEM_WIDTH = 180

export default function useVideo(video: ShallowRef<HTMLDivElement | undefined>) {
  const route = useRoute()
  const url = ref('')
  const cid = ref('')
  const site = ref<Site>(Site.qq)
  const art = shallowRef<Artplayer | null>(null)

  watchEffect(() => {
    cid.value = route.query.cid as string
    url.value = route.query.url as string
    site.value = route.query.site as Site
    initVideo()
  })

  onBeforeUnmount(() => {
    if (art.value?.destroy) {
      art.value.destroy(false)
    }
  })

  async function initVideo() {
    if (!video.value)
      return
    const data = await getVurl(url.value)
    if (!art.value) {
      const stateSvg = getSvgUrl('state.svg')
      const indicatorSvg = getSvgUrl('indicator.svg')
      const stateImg = `<img width="150" heigth="150" src="${stateSvg}">`
      const indicatorImg = `<img width="16" heigth="16" src="${indicatorSvg}">`
      art.value = new Artplayer({
        container: video.value,
        url: '',
        theme: '#23ade5',
        poster: getImageUrl('poster.png'),
        autoplay: false,
        pip: true,
        autoMini: true,
        screenshot: true,
        setting: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        miniProgressBar: true,
        backdrop: true,
        playsInline: true,
        fastForward: true,
        autoOrientation: true,
        autoPlayback: true,
        airplay: true,
        icons: {
          state: stateImg,
          indicator: indicatorImg,
        },
        customType: {
          m3u8: playM3u8,
          flv: playFlv,
        },
      })
    }
    if (data.code === 0) {
      art.value.switch = data.result
    }
  }

  return {
    cid,
    site,
    art,
  }
}

function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
  if (Hls.isSupported()) {
    const hls = new Hls()
    hls.loadSource(url)
    hls.attachMedia(video)
    art.hls = hls
    art.on('destroy', () => hls.destroy())
    hls.on(Hls.Events.ERROR, (_event, data) => {
      // 网络错误类型
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        art.notice.show = NOT_SUPPORTED
        art.loading.show = false
      }
    })
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
  }
  else {
    art.notice.show = NOT_SUPPORTED
  }
}

function playFlv(video: HTMLVideoElement, url: string, art: Artplayer) {
  if (flvjs.isSupported()) {
    const flv = flvjs.createPlayer({ type: 'flv', url })
    flv.attachMediaElement(video)
    flv.load()
    art.flv = flv
    art.on('destroy', () => flv.destroy())
  }
  else {
    art.notice.show = NOT_SUPPORTED
  }
}
