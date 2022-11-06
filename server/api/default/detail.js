const { getResult, restoreHtmlText } = require('../../utils')
const qqApi = require('../qq/search')

const homeApi = {
  async getDetail(query) {
    const { queryTxt, cid, url } = query
    const res = await qqApi.search(queryTxt, cid)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (res.code === 0) {
      const data = res.result
      const item = data.list?.[0]

      topList = data.relateList

      if (item) {
        introduction = await getIntro(item)
        videoInfo = getVideoInfo(item, url)
      }
    }
    return getResult({
      introduction,
      topList,
      videoInfo,
    })
  },
  async getPlaylist(query) {
    const { queryTxt, cid } = query
    const res = await qqApi.search(queryTxt, cid)
    let playList = []
    if (res.code === 0 && res.result.list?.[0]) {
      const item = res.result.list?.[0]
      playList = item.playlist
    }
    return getResult(playList)
  },
}

async function getIntro(item) {
  return {
    area_name: '',
    cover_description: item.desc,
    detail_info: item.sub.join(' · '),
    episode_all: '',
    hotval: '',
    main_genres: '',
    title: restoreHtmlText(item.title),
    update_notify_desc: '',
    year: '',
  }
}

function getVideoInfo(item, url) {
  const videoInfo = {
    c_covers: '',
    c_title_output: '',
    pioneer_tag: '',
    title: restoreHtmlText(item.title),
    type: -1,
    type_name: '',
    vid: '',
  }
  const playItem = item.playlist.find((data) => {
    return data.href === url
  })

  if (playItem) {
    videoInfo.c_covers = playItem.cid
    videoInfo.c_title_output = playItem.text
    videoInfo.vid = playItem.vid
  }

  return videoInfo
}

module.exports = homeApi
