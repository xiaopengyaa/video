const cheerio = require('cheerio')
const qs = require('qs')
const { api, getResult } = require('../../utils')

const homeApi = {
  // 搜索
  async search(keyword) {
    const url = `https://v.qq.com/x/search/`
    const html = await api.get(url, { q: keyword })
    const $ = cheerio.load(html)
    const list = []
    const relateList = []
    $('.search_container .mix_warp .result_item_v').each((index, elem) => {
      const cid = $(elem).attr('data-id')
      const image = $(elem).find('._infos .figure_pic').attr('src')
      const mark = $(elem).find('._infos .mark_v img').attr('src')
      const href = $(elem).find('._infos .result_title a').attr('href')
      const sub = $(elem).find('._infos .result_title .sub').text()
      const type = $(elem).find('._infos .result_title .type').text()
      const params = $(elem).find('.result_title').attr('dt-params')
      const title = qs
        .parse(params)
        .title_txt.replaceAll('\x05', '<span class="main">')
        .replaceAll('\x06', '</span>')

      const $desc = $(elem).find('._infos .desc_text')
      let desc = ''

      if ($desc.length) {
        desc = $desc.prop('firstChild').nodeValue
      }

      const { series, playlist } = getPlaylist($, elem, cid)
      const btnlist = getBtnlist($, elem, cid)

      list.push({
        cid,
        image,
        mark,
        title,
        href,
        sub: [type].concat(sub.replace(/\(|\)/g, '').split('/')),
        desc,
        series,
        playlist,
        btnlist,
      })
    })

    return getResult({
      list,
      relateList,
    })
  },
}

function getPlaylist($, elem, cid) {
  let series = '0'
  const playlist = []
  let $item = $(elem).find('._playlist .result_episode_list .item')

  if (!$item.length) {
    series = '1'
    $item = $(elem).find('._playlist .tmpinnerList ._series_list .item')
  }

  $item.each((cIndex, cElem) => {
    if (cElem.attribs.class && cElem.attribs.class.includes('unfold')) {
      return
    }
    const text = $(cElem).find('a').text()
    const mark = $(cElem).find('.mark_v img').attr('src') || ''
    let href = $(cElem).find('a').attr('href')
    let vid = ''

    // 处理href
    const reg = /cover\/(.*)\.html/
    const match = reg.exec(href)
    if (match) {
      vid = match[1].split('/').pop()
    }

    playlist.push({
      cid,
      vid,
      href,
      text,
      mark,
    })
  })

  return {
    series,
    playlist,
  }
}

function getBtnlist($, elem, cid) {
  const btnlist = []

  $(elem)
    .find('._playlist .result_btn_line .btn_primary')
    .each((cIndex, cElem) => {
      const text = $(cElem).find('.icon_text').text()
      const href = $(cElem).attr('href')
      let vid = ''

      // 处理href
      const reg = /cover\/(.*)\.html/
      const match = reg.exec(href)
      if (match) {
        vid = match[1].split('/').pop()
      }

      btnlist.push({
        cid,
        vid,
        href,
        text,
        mark: '',
      })
    })

  return btnlist
}

module.exports = homeApi
