const { api, getResult, getImageUrl, dedupe } = require('../../utils')
const { SITE } = require('../../utils/constant')
const { COOKIE, REFERER } = require('./constant')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const res = await getData(url)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (res) {
      const data = res.data.data.nodes.find((item) => item.type === 10001)
      const extraData = res.data.data.data.extra
      if (data) {
        introduction = getIntro(data, extraData)
        videoInfo = getVideoInfo(extraData)
        // topList = getTopList(data)
      }
    }
    return getResult({
      introduction,
      topList,
      videoInfo,
    })
  },
  async getPlaylist(query) {
    const { url } = query
    const res = await getData(url)
    let playList = []

    if (res) {
      const data = res.data.data.nodes.find((item) => item.type === 10001)
      const extraData = res.data.data.data.extra
      if (data) {
        const playData = data.nodes.find((item) => item.type === 10013)
        if (playData) {
          playData.nodes.forEach((item) => {
            const data = item.data
            const markType = data.mark?.mediaMarkType
            let mark = ''

            if (markType === 'VIP') {
              mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
            } else if (markType === 'TRAILER') {
              mark =
                '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
            }

            playList.push({
              vid: item.id.toString(),
              cid: extraData.showLongId.toString(),
              href: `https://v.youku.com/v_show/id_${data.action.value}.html`,
              text: data.stage.toString(),
              mark,
            })
          })
        }
      }
    }

    return getResult(playList)
  },
}

async function getData(url) {
  const html = await api.get(url, null, {
    headers: {
      cookie: COOKIE,
      referer: REFERER,
    },
  })
  const reg = /window\.__INITIAL_DATA__\s*=\s*(.*?);/
  const match = reg.exec(html)
  if (match) {
    return JSON.parse(match[1])
  }
}

function getIntro(res, extraData) {
  let result = {}
  const introData = res.nodes.find((item) => item.type === 10009)
  const splitStr = ' '
  if (introData) {
    const descData = introData.nodes.find((item) => item.type === 10010)
    if (descData) {
      const data = descData.data
      result = {
        area_name: data.area.join(splitStr),
        cover_description: data.desc,
        detail_info: getRateInfo(data),
        episode_all: extraData.episodeTotal.toString(),
        hotval: '',
        main_genres: data.showGenre,
        title: extraData.showName,
        update_notify_desc: data.updateInfo,
        year: data.showReleaseYear.toString(),
      }
    }
  }
  return result
}

function getTopList(pure_data) {
  const videos = pure_data.recommend_bk.videos
  let list = []
  if (videos?.length) {
    list = videos.slice(0, 10).map((item) => {
      let imageInfo = ''
      if (item.latest_episode_num) {
        imageInfo = item.is_series_done
          ? `${item.latest_episode_num}集全`
          : `更新至${item.latest_episode_num}集`
      } else if (item.score) {
        imageInfo = `${item.score}评分`
      }
      return {
        site: SITE.qiyi,
        cid: item.entity_id.toString(),
        image: getImageUrl(item.image_url),
        imageInfo,
        mark: '',
        title: item.title,
        href: item.page_url,
        sub: [],
        desc: '',
        playlist: [],
        btnlist: [],
      }
    })
  }
  return list
}

function getVideoInfo(item) {
  return {
    c_covers: item.showLongId.toString(),
    c_title_output: item.showVideoStage.toString(),
    pioneer_tag: '',
    title: item.videoTitle,
    type: -1,
    type_name: '',
    vid: item.videoLongId.toString(),
  }
}

function getRateInfo(item) {
  const arr = []
  if (item.doubanRate) {
    arr.push(`<font color="#FF6022">${item.doubanRate}评分</font>`)
  }

  if (item.heat) {
    arr.push(`${item.heat}热度`)
  }

  return arr.join(' · ')
}

module.exports = homeApi
