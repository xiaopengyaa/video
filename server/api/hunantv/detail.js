const { api, getResult, getDefaultVid } = require('../../utils')
const { SITE } = require('../../utils/constant')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const res = await getData(url)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (res && res.data?.length) {
      const video = res.data[0].videoInfo
      introduction = getIntro(video)
      videoInfo = getVideoInfo(video)
      topList = await getTopList(video.vid)
    }
    return getResult({
      introduction,
      topList,
      videoInfo,
    })
  },
  async getPlaylist(query) {
    const { url } = query
    const vid = getDefaultVid(url)
    const list = await getList(vid, 1)
    const colorMap = {
      1: '#222',
      2: '#fff',
      3: '#fff',
      7: '#222',
      8: '#222',
      9: '#222',
      10: '#222',
    }
    const result = list.map((item) => {
      const corner = item.corner?.find(c => c.area === 'rightUp')
      let mark = null
      if (corner) {
        mark = {
          backgroundColor: corner.color,
          fontColor: colorMap[corner.flag] || '#fff',
          text: corner.font,
        }
      }
      return {
        vid: item.video_id,
        cid: item.clip_id,
        href: `https://www.mgtv.com${item.url}`,
        text: item.t1,
        mark,
      }
    })
    return getResult(result)
  },
}

async function getList(vid, page) {
  const res = await api.get(`https://pcweb.api.mgtv.com/episode/list`, {
    page,
    size: 30,
    platform: 4,
    src: 'mgtv',
    allowedRC: 1,
    video_id: vid,
  })
  let list = []
  if (res.code === 200) {
    const data = res.data
    list = data.list
    if (data.current_page !== data.total_page) {
      page++
      list = list.concat(await getList(vid, page))
    }
  }
  return list
}

async function getData(url) {
  const html = await api.get(url)
  const reg = /window\.__NUXT__\s*=\s*\((.*?)\);/
  const match = reg.exec(html)
  if (match) {
    // eslint-disable-next-line no-new-func
    return new Function(`return ${match[1]}`)()
  }
}

function getIntro(videoInfo) {
  const detail = videoInfo?.detail
  return {
    area_name: detail.area,
    cover_description: detail.story,
    detail_info: detail.updateInfo,
    episode_all: '',
    hotval: detail.playCnt,
    main_genres: detail.kind,
    title: videoInfo.clipName,
    update_notify_desc: '',
    year: '',
  }
}

async function getTopList(vid) {
  const res = await api.get(`https://rc-channel.bz.mgtv.com/pc_like`, {
    pageNum: 1,
    pageSize: 10,
    allowedRC: 1,
    vid,
  })
  let list = []
  if (res.code === 200 && res.data?.length) {
    list = res.data.slice(0, 10).map((item) => {
      return {
        site: SITE.hunantv,
        cid: item.clipId.toString(),
        image: item.previewVideoImg,
        imageInfo: item.fdcornerDown,
        mark: '',
        title: item.title,
        href: item.play_url,
        sub: [],
        desc: item.subtitle,
        playlist: [],
        btnlist: [],
      }
    })
  }
  return list
}

function getVideoInfo(videoInfo) {
  return {
    c_covers: videoInfo.cid,
    c_title_output: videoInfo.videoName,
    pioneer_tag: '',
    title: videoInfo.videoName,
    type: -1,
    type_name: videoInfo.chn,
    vid: videoInfo.vid,
  }
}

module.exports = homeApi
