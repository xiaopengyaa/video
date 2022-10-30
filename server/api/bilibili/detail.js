const { api, getResult, addChineseUnit, getImageUrl } = require('../../utils')
const { SITE } = require('../../utils/constant')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const data = await getData(url)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (data) {
      const seasonId = data.mediaInfo.season_id.toString()
      introduction = await getIntro(data.mediaInfo)
      videoInfo = getVideoInfo(data.epInfo, seasonId)
      topList = await getTopList(seasonId)
    }
    return getResult({
      introduction,
      topList,
      videoInfo,
    })
  },
  async getPlaylist(query) {
    const { url } = query
    const data = await getData(url)
    let playList = []
    if (data) {
      const cid = data.mediaInfo.season_id.toString()
      playList = data.mediaInfo.episodes.map((item) => {
        const mark =
          item.badge === '会员'
            ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
            : item.badge === '预告'
            ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
            : ''
        return {
          vid: item.id.toString(),
          cid,
          href: item.link,
          text: item.title,
          mark,
        }
      })
    }
    return getResult(playList)
  },
}

async function getData(url) {
  const html = await api.get(url)
  const reg = /window\.__INITIAL_STATE__=(.*?);\(/
  const match = reg.exec(html)
  if (match) {
    return JSON.parse(match[1])
  }
}

async function getIntro(mediaInfo) {
  return {
    area_name: mediaInfo.areas[0]?.name || '',
    cover_description: mediaInfo.evaluate,
    detail_info: await getRateInfo(mediaInfo),
    episode_all: mediaInfo.total.toString(),
    hotval: '',
    main_genres: mediaInfo.ssTypeFormat.name,
    title: mediaInfo.season_title,
    update_notify_desc: mediaInfo.new_ep.desc,
    year: '',
  }
}

async function getTopList(seasonId) {
  const res = await api.get(
    `https://api.bilibili.com/pgc/season/web/related/recommend?season_id=${seasonId}`
  )
  let list = []
  if (res.code === 0 && res.data.season?.length) {
    list = res.data.season.slice(0, 10).map((item) => {
      return {
        site: SITE.bilibili,
        cid: item.season_id.toString(),
        image: getImageUrl(item.new_ep.cover),
        imageInfo: item.new_ep.index_show,
        mark: '',
        title: item.title,
        href: item.url,
        sub: [],
        desc: '',
        playlist: [],
        btnlist: [],
      }
    })
  }
  return list
}

function getVideoInfo(epInfo, seasonId) {
  return {
    c_covers: seasonId,
    c_title_output: epInfo.title,
    pioneer_tag: '',
    title: epInfo.share_copy,
    type: -1,
    type_name: '',
    vid: epInfo.id.toString(),
  }
}

async function getRateInfo(item) {
  const res = await api.get(
    `https://api.bilibili.com/pgc/web/season/stat?season_id=${item.season_id}`
  )
  let str = ''
  if (res.code === 0) {
    const count = res.result
    const score = `<font color="#FF6022">${item.rating.score}评分</font>`
    const views = `${addChineseUnit(count.views, 1)}播放`
    const follow = `${addChineseUnit(count.series_follow, 1)}系列追番`
    str = [score, views, follow].join(' · ')
  }
  return str
}

module.exports = homeApi
