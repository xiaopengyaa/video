const cheerio = require('cheerio')
const qs = require('qs')
const { api, getResult, getSiteByUrl, processUrl } = require('../../utils')
const { COOKIE, REFERER } = require('./constant')

const homeApi = {
  // 搜索
  async search(keyword, cid) {
    const url = `https://v.qq.com/x/search/`
    const html = await api.get(url, { q: keyword })
    const $ = cheerio.load(html)
    const list = await getSearchList($, cid)
    const relateList = getRelateList($, cid)

    return getResult({
      list,
      relateList,
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
      }
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
  let match = $('.result_series_new')
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
          mark: video.imgTag?.tag_2?.param['1X'] || '',
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

async function getSearchList($, targetCid = '') {
  const list = []
  const arr = []
  const $resultItem = $('.search_container .mix_warp .result_item_v')
  $resultItem.each((index, elem) => {
    const cid = $(elem).attr('data-id')

    // 如果targetCid存在，则表示精准查找
    // 模糊判断：如果结果只有一条，也通过
    if ($resultItem.length !== 1 && targetCid && targetCid !== cid) {
      return
    }

    const image = $(elem).find('._infos .figure_pic').attr('src')
    const imageInfo = $(elem).find('._infos .figure_info').text() || ''
    const mark = $(elem).find('._infos .mark_v img').attr('src')
    const href = $(elem).find('._infos .result_title a').attr('href')
    const sub = $(elem).find('._infos .result_title .sub').text()
    const type = $(elem).find('._infos .result_title .type').text()
    const params = $(elem).find('.result_title').attr('dt-params')
    const title = qs
      .parse(params)
      .title_txt.replaceAll('\x05', '<span class="main">')
      .replaceAll('\x06', '</span>')
    const site = qs.parse(params).site_id

    const $desc = $(elem).find('._infos .desc_text')
    let desc = ''

    if ($desc.length) {
      desc = $desc.prop('firstChild').nodeValue
    }

    const obj = processUrl(href)
    const btnlist = getBtnlist($, elem, cid)

    // 将异步请求存起来
    arr.push({
      $,
      elem,
      cid,
      site,
    })

    list.push({
      site,
      cid,
      image,
      imageInfo,
      mark,
      title,
      href: obj.href,
      sub: [type].concat(sub.replace(/\(|\)/g, '').split('/')),
      desc,
      playlist: [],
      btnlist,
    })
  })
  const data = await Promise.all(
    arr.map(({ $, elem, cid, site }) => {
      return getPlaylist($, elem, cid, site, !!targetCid)
    })
  )
  data.forEach((item, index) => {
    list[index].playlist = item.playlist
  })
  return list
}

async function getPlaylist($, elem, cid, site, isAll = false) {
  let playlist = []

  if (isAll) {
    playlist = await getPlaylistAll(cid, site)
  } else {
    let $item = $(elem).find('._playlist .result_episode_list .item')

    if (!$item.length) {
      $item = $(elem).find('._playlist .tmpinnerList ._series_list .item')
    }

    $item.each((cIndex, cElem) => {
      if (cElem.attribs.class && cElem.attribs.class.includes('unfold')) {
        return
      }
      const text = $(cElem).find('a').text()
      const mark = $(cElem).find('.mark_v img').attr('src') || ''
      let href = $(cElem).find('a').attr('href')

      // 处理href
      if (href.includes('javascript')) {
        href = ''
      }
      const obj = processUrl(href)

      playlist.push({
        cid,
        vid: obj.vid,
        href: obj.href,
        text,
        mark,
      })
    })
  }

  return {
    playlist,
  }
}

async function getPlaylistAll(cid, site, pageContext = '') {
  let list = []
  const url = `https://pbaccess.video.qq.com/trpc.videosearch.search_cgi.http/load_playsource_list_info`
  const res = await api.get(
    url,
    {
      pageNum: 0,
      id: cid,
      dataType: '2',
      pageContext,
      // 猜测sence为1返回部分，为2返回全部
      scene: 2,
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
    }
  )

  if (res.data?.errorCode === 0) {
    const firstBlockSites =
      res.data.normalList.itemList?.[0].videoInfo.firstBlockSites?.[0]
    const episodeInfoList = firstBlockSites.episodeInfoList
    const tabs = firstBlockSites.tabs
    episodeInfoList.forEach((item) => {
      const obj = processUrl(item.url)
      let mark = ''
      if (item.markLabel) {
        if (item.markLabel.includes('vip')) {
          mark = '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
        } else if (item.markLabel.includes('trailerlite')) {
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
          promiseArr.push(getPlaylistAll(cid, site, tab.asnycParams))
        }
      })
      const dataArr = await Promise.all(promiseArr)
      list = list.concat(dataArr.flat())
    }
  }
  return list
}

function getBtnlist($, elem, cid) {
  const btnlist = []

  $(elem)
    .find('._playlist .result_btn_line .btn_primary')
    .each((cIndex, cElem) => {
      const text = $(cElem).find('.icon_text').text()
      const href = $(cElem).attr('href')
      const obj = processUrl(href)

      btnlist.push({
        cid,
        vid: obj.vid,
        href: obj.href,
        text,
        mark: '',
      })
    })

  return btnlist
}

module.exports = homeApi
