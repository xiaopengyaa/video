import type { ShallowRef } from 'vue'
import type { ParserType } from '@/types/enum'
import { Site } from '@/types/enum'
import { getVurl } from '@/api/detail'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import flvjs from 'flv.js'
import { getImageUrl, getSvgUrl } from '@/utils/common'

const NOT_SUPPORTED = '播放失败，有问题请联系最帅的那位。'
Artplayer.NOTICE_TIME = 3000
Artplayer.SETTING_WIDTH = 180
Artplayer.SETTING_ITEM_WIDTH = 180

export default function useVideo(video: ShallowRef<HTMLDivElement | undefined>, type: Ref<ParserType>) {
  const route = useRoute()
  const url = ref('')
  const process = ref('')
  const site = ref<Site>(Site.qq)
  const art = shallowRef<Artplayer | null>(null)

  watchEffect(() => {
    url.value = route.query.url as string
    process.value = route.query.progress as string || ''
    site.value = route.query.site as Site
    initVideo()
  })

  async function initVideo() {
    if (!video.value) {
      return
    }
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
        icons: {
          state: stateImg,
          indicator: indicatorImg,
        },
        customType: {
          m3u8: playM3u8,
          flv: playFlv,
        },
      })
      art.value.on('ready', () => {
        // 回显播放进度
        if (process.value) {
          art.value.currentTime = Number(process.value)
        }
      })
    }
    try {
      art.value.loading.show = true
      const data = await getVurl(url.value, type.value)
      if (data) {
        art.value.switch = data
      }
      else {
        throw new Error(NOT_SUPPORTED)
      }
    }
    catch (e) {
      if (e && e.code === 'ERR_CANCELED') {
        return
      }
      art.value.notice.show = NOT_SUPPORTED
      art.value.loading.show = false
    }
  }

  return {
    url,
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
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR && data.details === Hls.ErrorDetails.FRAG_PARSING_ERROR) {
        console.error('media错误:', data.details)
        // 重试超过一定次数就不再重试，提示用户
        const action = data.errorAction
        const retryConfig = action?.retryConfig
        if (retryConfig && retryConfig.maxNumRetry === action.retryCount) {
          art.notice.show = '当前分片解析失败。'
        }
        return
      }
      console.error('hls错误:', data)
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
