const { api, getResult } = require('../../utils')
const { COOKIE, REFERER } = require('./constant')
const { SITE } = require('../../utils/constant')

const homeApi = {
  async getDetail(query) {
    const { url } = query
    const html = await api.get(url)
    const reg = /window\.__PINIA__=(.*?)<\/script>/
    const match = reg.exec(html)
    let introduction = {}
    let topList = []
    let videoInfo = {}
    if (match) {
      const data = eval('(' + match[1] + ')')
      introduction = data.introduction.introData.list[0].item_params
      topList = processTopList(data.topList.data)
      videoInfo = data.global.videoInfo
      tabs = data.episodeMain.listData[0].tabs
    }
    return getResult({
      introduction,
      topList,
      videoInfo,
      tabs,
    })
  },
  async getPlaylist(query) {
    const { cid, tabs } = query
    const promiseArr = []

    // 如果有tabs，则依次请求，没有的话，就请求1次。
    if (tabs && tabs.length) {
      tabs.forEach((tab) => {
        promiseArr.push(getList(cid, tab.pageContext))
      })
    } else {
      promiseArr.push(getList(cid, ''))
    }

    const list = (await Promise.all(promiseArr)).flat()

    return getResult(
      list.map((item) => {
        const vid = item.item_params.vid
        const text = item.item_params.title
        const isTrailer = item.item_params.is_trailer
        const mark =
          isTrailer === '0'
            ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
            : '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
        return {
          vid,
          cid,
          href: `https://v.qq.com/x/cover/${cid}/${vid}.html`,
          text,
          mark: item.item_params.imgtag_all ? mark : '',
        }
      })
    )
  },
}

async function getList(cid, page_context) {
  const res = await api.post(
    'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2',
    {
      page_params: {
        req_from: 'web_vsite',
        page_id: 'vsite_episode_list',
        page_type: 'detail_operation',
        id_type: '1',
        cid,
        vid: '',
        lid: '',
        page_num: '',
        page_size: '',
        detail_page_type: '1',
        page_context,
      },
      has_cache: 0,
    },
    {
      headers: {
        cookie: COOKIE,
        referer: REFERER,
      },
    }
  )

  let list = []

  if (res.data.module_list_datas.length) {
    list =
      res.data.module_list_datas[0].module_datas[0].item_data_lists.item_datas
  }
  return list
}

function processTopList(list) {
  return list.map((item) => {
    return {
      site: SITE.qq,
      cid: item.id,
      image: item.pic,
      imageInfo: item.timelong,
      mark: '',
      title: item.title,
      href: `https://v.qq.com/x/cover/${item.id}.html`,
      sub: [],
      desc: '',
      playlist: [],
      btnlist: [],
    }
  })
}

module.exports = homeApi
