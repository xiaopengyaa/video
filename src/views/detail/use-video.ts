import type { ShallowRef } from 'vue'
import type { ParserType } from '@/types/enum'
import { Site } from '@/types/enum'
import { getVurl } from '@/api/detail'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import flvjs from 'flv.js'
import { getImageUrl, getSvgUrl } from '@/utils/common'
import { updateBus } from '@/utils/event-bus'
import { PROGRESS_KEY } from '@/utils/constant'

const NOT_SUPPORTED = '播放失败，有问题请联系最帅的那位。'
Artplayer.NOTICE_TIME = 3000
Artplayer.SETTING_WIDTH = 180
Artplayer.SETTING_ITEM_WIDTH = 180

export default function useVideo(video: ShallowRef<HTMLDivElement>, type: Ref<ParserType>) {
  const router = useRouter()
  const route = useRoute()
  const url = ref('')
  const process = ref('')
  const site = ref<Site>(Site.qq)
  const art = shallowRef<Artplayer | null>(null)
  const progressStorage = useLocalStorage(PROGRESS_KEY, '')

  watchEffect(() => {
    url.value = route.query.url as string
    process.value = route.query.progress as string || ''
    site.value = route.query.site as Site
    initVideo()
  })

  onMounted(() => {
    if (progressStorage.value) {
      updateRouteProgress(Number(progressStorage.value))
      progressStorage.value = ''
    }
    updateBus.on(() => {
      updateRouteProgress(art.value?.currentTime)
    })
  })

  async function initVideo() {
    if (!video.value || !type.value) {
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
        autoplay: true,
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
        autoPlayback: false,
        icons: {
          state: stateImg,
          indicator: indicatorImg,
        },
        moreVideoAttr: {
          preload: 'metadata',
        },
        customType: {
          m3u8: playM3u8,
          flv: playFlv,
        },
      })
    }
    try {
      art.value.loading.show = true
      const data = await getVurl(url.value, type.value)
      if (data) {
        art.value.once('video:canplay', () => {
          echoProcess()
        })
        art.value.url = data
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

  // 回显播放进度
  function echoProcess() {
    console.log('echoProcess', process.value)
    if (process.value) {
      art.value.currentTime = Number(process.value)
    }
  }

  function updateRouteProgress(currentTime?: number) {
    if (currentTime > 0) {
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          progress: currentTime.toFixed(0),
        },
      })
    }
  }

  return {
    url,
    site,
    art,
  }
}

function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }
  else if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
    })
    hls.loadSource(url)
    hls.attachMedia(video)
    art.hls = hls
    art.on('destroy', () => hls.destroy())
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play()
    })
    hls.on(Hls.Events.ERROR, (_event, data) => {
      // 网络错误类型
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        art.notice.show = NOT_SUPPORTED
        art.loading.show = false
      }
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        console.error('media错误:', data.details)
        if (data.details === Hls.ErrorDetails.FRAG_PARSING_ERROR) {
          // 重试超过一定次数就不再重试，提示用户
          const action = data.errorAction
          const retryConfig = action?.retryConfig
          if (retryConfig && retryConfig.maxNumRetry === action.retryCount) {
            art.notice.show = '当前分片解析失败。'
          }
        }
        return
      }
      console.error('hls错误:', data)
    })
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
