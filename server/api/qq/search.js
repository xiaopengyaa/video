const { api, getResult, getSiteByUrl, processUrl } = require('../../utils')
const { COOKIE, REFERER } = require('./constant')
const { generateUuid } = require('../../utils/searchUtil')

const homeApi = {
  // 搜索
  async search(keyword, cid) {
    const params = {
      version: '24072901',
      clientType: 1,
      filterValue: '',
      retry: 0,
      query: keyword,
      pagenum: 0,
      pagesize: 30,
      queryFrom: 0,
      searchDatakey: '',
      transInfo: '',
      isneedQc: true,
      preQid: '',
      adClientInfo: '',
      extraInfo: { isNewMarkLabel: '1', multi_terminal_pc: '1' },
      uuid: generateUuid(),
    }
    const url = `https://pbaccess.video.qq.com/trpc.videosearch.mobile_search.MultiTerminalSearch/MbSearch?vplatform=2`
    const res = await api.post(url, params, {
      headers: {
        'cookie': COOKIE,
        'origin': REFERER,
        'referer': REFERER,
        'content-type': 'application/json',
        'trpc-trans-info': '{"trpc-env":""}',
      },
    })

    let list = []

    if (res.ret === 0) {
      list = getSearchList(res.data)
    }

    // const relateList = getRelateList($, cid)

    if (!list.length) {
      console.log(`搜索结果【${keyword}】为空`)
    }

    return getResult({
      list,
      relateList: [],
    })
  },
  async getRecommendList(keyword) {
    const url = `https://nodeyun.video.qq.com/x/api/smartbox`
    const now = +new Date()
    const callback = `jQuery19105739095169365356_${now}`
    const html = await api.get(
      url,
      {
        query: keyword,
        callback,
        _: now,
      },
      {
        headers: {
          cookie: COOKIE,
          referer: REFERER,
        },
      },
    )
    const reg = new RegExp(`${callback}\\((.*)\\)`)
    const match = html.match(reg)
    let list = []
    if (match) {
      const res = JSON.parse(match[1])
      if (res.ret === 0 && res.data?.smartboxItemList) {
        list = res.data.smartboxItemList.map((item) => {
          return {
            title: item.basicDoc.title.replace(/em/g, 'strong'),
            imgUrl: item.videoInfo.imgUrl,
            videoType: item.videoInfo.videoType,
            typeName: item.videoInfo.typeName,
          }
        })
      }
    }
    return getResult(list)
  },
}

function getRelateList($, targetCid) {
  let list = []
  const match = $('.result_series_new')
    .attr('r-props')
    ?.match(/totalData:\s*'(.*)'/)
  let data
  if (match) {
    data = JSON.parse(decodeURIComponent(match[1]))
    list = data.itemList
      .filter((item) => {
        const obj = processUrl(item.videoInfo.url)
        return targetCid !== obj.cid
      })
      .slice(0, 20)
      .map((item) => {
        const video = item.videoInfo
        const obj = processUrl(video.url)
        const playlist = []

        if (video.firstBlockSites[0]?.episodeInfoList) {
          video.firstBlockSites[0]?.episodeInfoList.forEach((cItem, cIndex) => {
            const text = cItem.title
            const cObj = processUrl(cItem.url)
            let mark = ''

            if (cItem.markLabel) {
              const label = JSON.parse(cItem.markLabel)
              if (label.tag_2?.param) {
                const cMatch = label.tag_2.param.match(/1X=(.*);/)
                if (cMatch) {
                  mark = cMatch[1]
                }
              }
            }

            playlist.push({
              cid: obj.cid,
              vid: cObj.vid,
              href: cObj.href,
              text,
              mark,
            })
          })
        }
        return {
          site: getSiteByUrl(obj.href),
          cid: obj.cid,
          image: video.imgUrl,
          imageInfo: video.imgTag?.tag_3?.text || '',
          mark: video.imgTag?.tag_2?.param?.['1X'] || '',
          title: video.title
            .replaceAll('\u0005', '<span class="main">')
            .replaceAll('\u0006', '</span>'),
          href: obj.href,
          sub: [],
          desc: '',
          playlist,
          btnlist: [],
        }
      })
  }

  return list
}

function getSearchList(data) {
  const list = []
  const itemList = data.normalList.itemList
  const areaBoxList = data.areaBoxList.map((item) => {
    return item.itemList.filter(
      cItem => cItem?.videoInfo?.episodeSites?.length,
    )
  })
  const allList = itemList.concat(areaBoxList.flat())

  if (allList && allList.length > 0) {
    allList.forEach((item) => {
      if (item.videoInfo) {
        const videoInfo = item.videoInfo
        const cid = item?.doc?.id || ''
        const episodeSites = videoInfo.episodeSites?.filter(
          site => site?.episodeInfoList?.length,
        )
        const playSites = videoInfo.playSites
        let allSites = []
        let isPlaySite = false
        if (episodeSites && episodeSites.length > 0) {
          allSites = episodeSites
        }
        else if (playSites && playSites.length > 0) {
          allSites = playSites
          isPlaySite = true
        }
        if (allSites && allSites.length > 0) {
          const episodeSite = allSites[0]
          const imgTag = videoInfo.imgTag
          let mark = null
          let imageInfo = ''
          try {
            const obj = JSON.parse(imgTag)
            imageInfo = obj.tag_4.text
            mark = obj.tag_2
          }
          catch (e) {
            console.log(e)
          }
          const item = {
            site: episodeSite.enName,
            cid,
            image: videoInfo.imgUrl,
            imageInfo,
            mark,
            title: videoInfo.title,
            href: '',
            sub: [videoInfo.typeName, videoInfo.area],
            desc: videoInfo.descrip,
            playlist: [],
            btnlist: [],
          }
          if (
            episodeSite.episodeInfoList
            && episodeSite.episodeInfoList.length > 0
          ) {
            episodeSite.episodeInfoList.forEach((cItem) => {
              const urlObj = processUrl(cItem.url)
              let mark = null
              try {
                if (cItem.markLabel) {
                  const obj = JSON.parse(cItem.markLabel)
                  mark = obj.tag_2
                }
              }
              catch (e) {
                console.log(e)
              }
              const playItem = {
                cid: urlObj.cid,
                vid: urlObj.vid,
                href: urlObj.href,
                text: cItem.title,
                mark,
              }
              if (episodeSite.uiType === 3 || isPlaySite) {
                item.btnlist.push(playItem)
              }
              else {
                item.playlist.push(playItem)
              }
            })
          }
          list.push(item)
        }
      }
    })
  }

  return list
}

async function getPlaylist(cid, site, isAll, pageContext = '') {
  let list = []
  let uiType = -1
  const url = `https://pbaccess.video.qq.com/trpc.videosearch.search_cgi.http/load_playsource_list_info`
  const res = await api.get(
    url,
    {
      pageNum: 0,
      id: cid,
      dataType: '2',
      pageContext,
      // 猜测sence为1返回部分，为2返回全部
      scene: isAll ? 2 : 1,
      platform: 2,
      appId: '10718',
      site,
      vappid: '34382579',
      vsecret: 'e496b057758aeb04b3a2d623c952a1c47e04ffb0a01e19cf',
    },
    {
      headers: {
        cookie: COOKIE,
        referer: REFERER,
      },
    },
  )

  if (res.data?.errorCode === 0) {
    const firstBlockSites
      = res.data.normalList.itemList?.[0].videoInfo.firstBlockSites?.[0]
    const episodeInfoList = firstBlockSites.episodeInfoList
    const tabs = firstBlockSites.tabs

    uiType = firstBlockSites.uiType
    episodeInfoList.forEach((item) => {
      const obj = processUrl(item.url)
      let mark = ''
      if (item.markLabel) {
        if (item.markLabel.includes('vip')) {
          mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
        }
        else if (item.markLabel.includes('trailerlite')) {
          mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
        }
      }

      list.push({
        cid,
        vid: obj.vid,
        href: obj.href,
        text: item.title,
        mark,
      })
    })
    if (!pageContext && tabs?.length > 1) {
      const promiseArr = []
      tabs.forEach((tab, index) => {
        // 获取除第一个的数据
        if (index > 0) {
          promiseArr.push(getPlaylist(cid, site, isAll, tab.asnycParams))
        }
      })
      const dataArr = await Promise.all(promiseArr)
      dataArr.forEach((data) => {
        list = list.concat(data.list)
      })
    }
  }
  return {
    uiType,
    list,
  }
}

module.exports = homeApi
