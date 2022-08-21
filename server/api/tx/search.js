const cheerio = require('cheerio')
const { api, getResult } = require('../../utils')

const homeApi = {
  // 搜索
  async search(keyword) {
    const url = `https://v.qq.com/x/search/`
    const html = await api.get(url, { q: keyword })
    const $ = cheerio.load(html)
    const list = []
    const relateList = []
    $('.search_container .mix_warp')
      .children()
      .each((index, elem) => {
        const cid = $(elem).find('.result_item').attr('data-id')
        const image = $(elem).find('._infos .figure_pic').attr('src')
        const mark = $(elem).find('._infos .mark_v img').attr('src')
        const href = $(elem).find('._infos .result_title a').attr('href')
        const $h1 = $(elem).find('._infos .result_title .hl')
        const sub = $(elem).find('._infos .result_title .sub').text()
        const type = $(elem).find('._infos .result_title .type').text()
        const desc = $(elem)
          .find('._infos .desc_text')
          .prop('firstChild').nodeValue

        const playlist = []
        let title = $h1.text()

        if ($h1[0].next.type === 'text') {
          title += $h1[0].next.data
        }

        $(elem)
          .find('._playlist .result_episode_list .item')
          .each((cIndex, cElem) => {
            if (cElem.attribs.class && cElem.attribs.class.includes('unfold')) {
              return
            }
            const num = $(cElem).find('a').text()
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
              num,
              mark,
            })
          })

        // 暂时不要没有集数的
        if (!playlist.length) {
          return
        }

        list.push({
          cid,
          image,
          mark,
          title,
          href,
          sub: [type].concat(sub.replace(/\(|\)/g, '').split('/')),
          desc,
          playlist,
        })
      })

    return getResult({
      list,
      relateList,
    })
  },
}

module.exports = homeApi
