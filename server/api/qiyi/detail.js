const { api, getResult, getImageUrl } = require('../../utils')
const { SITE } = require('../../utils/constant')
const { SUCCESS_CODE } = require('./constant')
const { getSign } = require('./md5')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const data = await getData(url)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (data) {
      const [baseData, episodeData] = await Promise.all([
        getBaseInfo(data.albumId),
        getEpisodeInfo(data.tvId),
      ])

      if (data && episodeData) {
        introduction = getIntro(baseData, episodeData.base_data)
        videoInfo = getVideoInfo(data.tvId, episodeData.base_data)
        topList = getTopList(episodeData.template.pure_data)
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
    const data = await getData(url)
    let playList = []

    if (!data) {
      return getResult(playList)
    }

    const episodeData = await getEpisodeInfo(data.tvId)
    if (episodeData?.template.pure_data.selector_bk) {
      const playData = episodeData.template.pure_data.selector_bk.find(
        (item) => item.entity_id === data.albumId
      )
      if (playData) {
        if (playData.video_list_type === 'poster') {
          playData.videos = transVideos(playData.videos)
        }
        playData.videos.page_keys.forEach((key) => {
          playData.videos.feature_paged[key].forEach((item) => {
            if (!item.page_url) {
              return
            }

            let mark = ''
            let text = item.album_order.toString()

            if (item.content_type === 28) {
              text = item.short_display_name
            }

            if (item.pay_mark > 0) {
              mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
            } else if (item.content_type === 3) {
              mark =
                '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
            }

            playList.push({
              vid: item.qipu_id.toString(),
              cid: data.albumId.toString(),
              href: item.page_url,
              text,
              mark,
            })
          })
        })
      }
    } else if (episodeData?.template.pure_data.film_feature_bk) {
      const videos = episodeData.template.pure_data.film_feature_bk.videos
      videos.forEach((item) => {
        if (!item.page_url) {
          return
        }

        let mark = ''

        if (item.pay_mark > 0) {
          mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
        }

        playList.push({
          vid: item.qipu_id.toString(),
          cid: data.albumId.toString(),
          href: item.page_url,
          text: item.title,
          mark,
        })
      })
    }
    return getResult(playList)
  },
}

async function getData(url) {
  const html = await api.get(url)
  const reg = /window\.Q\.PageInfo\.playPageInfo=(.*?);/
  const match = reg.exec(html)
  if (match) {
    return JSON.parse(match[1])
  }
}

function getIntro(mediaInfo, baseData) {
  const categories =
    mediaInfo?.categories.slice(0, 3).map((item) => item.name) || []
  const splitStr = ' '
  const year = mediaInfo?.publishTime
    ? new Date(mediaInfo.publishTime).getFullYear().toString()
    : ''
  return {
    area_name: mediaInfo?.areas.join(splitStr) || '',
    cover_description: baseData.desc,
    detail_info: getRateInfo(baseData),
    episode_all: mediaInfo?.videoCount.toString() || '',
    hotval: '',
    main_genres: categories.join(splitStr),
    title: baseData.title,
    update_notify_desc: mediaInfo?.updateStrategy || '',
    year,
  }
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
        series: '',
        playlist: [],
        btnlist: [],
      }
    })
  }
  return list
}

async function getEpisodeInfo(tvId) {
  const f = {
    entity_id: tvId,
    timestamp: +new Date(),
    src: 'pcw_tvg',
    vip_status: 0,
    vip_type: '',
    auth_cookie: '',
    device_id: '8405e9fc31a6290117e65c02741557be',
    user_id: '',
    app_version: '3.0.0',
  }
  const sign = getSign(f).toUpperCase()
  f.sign = sign

  const res = await api.get('https://mesh.if.iqiyi.com/tvg/pcw/base_info', f)
  if (res.status_code === 0) {
    return res.data
  }
}

async function getBaseInfo(albumId) {
  const res = await api.get(
    `https://pcw-api.iqiyi.com/album/album/baseinfo/${albumId}`
  )
  if (res.code === SUCCESS_CODE) {
    return res.data
  }
}

function getVideoInfo(tvId, item) {
  return {
    c_covers: item.qipu_id.toString(),
    c_title_output: item.current_video_title,
    pioneer_tag: '',
    title: item.current_video_title,
    type: -1,
    type_name: '',
    vid: tvId.toString(),
  }
}

function getRateInfo(item) {
  let str = ''
  const score = `<font color="#FF6022">${item.score_info.sns_score}评分</font>`
  const views = `${item.heat}热度`
  str = [score, views].join(' · ')
  return str
}

function transVideos(videos) {
  const page_keys = []
  const feature_paged = {}
  videos.forEach(function (item) {
    page_keys.push(item.title)
    feature_paged[item.title] = item.data
  })
  return {
    page_keys,
    feature_paged,
  }
}

module.exports = homeApi
