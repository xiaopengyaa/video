const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const { getResult, getImageUrl } = require('../../utils')
const { SITE } = require('../../utils/constant')

const MAX = 5
let browser
let page1
let page2

initPage('https://v.youku.com/')

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
        // topList = await getTopList(page1)
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
    const res = await getData(url, page2)
    let playList = []
    if (res) {
      const data = res.data.data.nodes.find((item) => item.type === 10001)
      const playData = data?.nodes.find((item) => item.type === 10013)
      if (playData) {
        playList = playData.nodes.map((item) => {
          const mark =
            item.data.mark?.mediaMarkType === 'VIP'
              ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_vip.png'
              : item.data.mark?.mediaMarkType === 'TRAILER'
              ? '//vfiles.gtimg.cn/vupload/20210322/tag_mini_trailerlite.png'
              : ''
          return {
            vid: item.id.toString(),
            cid: item.data.action.extra.showId,
            href: `https://v.youku.com/v_show/id_${item.data.action.value}.html`,
            text: item.data.stage.toString(),
            mark,
          }
        })
      }
    }
    return getResult(playList)
  },
}

async function getData(url, page = page1) {
  await autoAuthSlider(url, 0, page)
  const html = await page.evaluate(() => document.body?.innerHTML)
  const reg = /window\.__INITIAL_DATA__\s*=\s*(.*?);/
  const match = reg.exec(html)
  if (match) {
    try {
      return JSON.parse(match[1])
    } catch {
      return eval('(' + match[1] + ')')
    }
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

async function getTopList(page) {
  await page.click('.change_2WLXA')
  const html = await page.evaluate(() => document.body?.innerHTML)
  const $ = cheerio.load(html)
  const list = []
  $('.inner-content_cJrHm')
    .find('.work_2pWxC')
    .each((index, elem) => {
      const title = $(elem).find('.title_3xEmp a').text()
      const href = $(elem).find('.title_3xEmp a').attr('href')
      const desc = $(elem).find('.subtitle_3g15_').text()
      const image = $(elem).find('a img').attr('src')
      const match = href.match(/id_(.*)\.html/)
      const imageInfo = $(elem).find('.rightbottom_3utIe').text()
      let cid = ''

      if (match) {
        cid = match[1]
      }

      list.push({
        site: SITE.qiyi,
        cid,
        image: getImageUrl(image),
        imageInfo,
        mark: '',
        title,
        href,
        sub: [],
        desc,
        playlist: [],
        btnlist: [],
      })
    })
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

async function initPage(url) {
  if (browser) {
    try {
      browser.close()
    } catch (e) {
      console.log('browser关闭失败', e)
    }
  }
  console.time('puppeteer启动')
  browser = await puppeteer.launch({
    headless: true, // 在无界面的环境中运行Chrome
    defaultViewport: { width: 1366, height: 768 }, // 默认宽高
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  })
  page1 = await browser.newPage()
  page2 = await browser.newPage()
  console.timeEnd('puppeteer启动')
  await autoAuthSlider(url, 0, page2)
  await autoAuthSlider(url, 0, page1)
}

async function autoAuthSlider(url, num = 0, page = page1) {
  await page.goto(url)

  if (!(await isAuthPage(page))) {
    if (num > 0) {
      console.log(`验证成功：${url}`)
    }
    return
  }
  console.log(`滑块验证${num + 1}：${url}`)

  await page.evaluate(async () => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })
  await page.waitForSelector('.slidetounlock')

  let sliderElement = await page.$('.slidetounlock') // 整个滑动条节点
  let slider = await sliderElement.boundingBox() // 返回元素的x,y坐标以及宽高
  let sliderHandle = await page.$('.nc_iconfont.btn_slide') // 滑块节点
  let handle = await sliderHandle.boundingBox()

  // 将鼠标放到滑块中心点。
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  )
  // 按下鼠标
  await page.mouse.down()
  // 将鼠标右移到滑动条最右端
  await page.mouse.move(handle.x + slider.width, handle.y + handle.height / 2, {
    steps: 250,
  })
  // 放开鼠标
  await page.mouse.up()
  await page.waitForTimeout(500)

  if (await isAuthPage(page)) {
    if (num >= MAX) {
      console.log(`验证失败：${url}`)
      return
    }
    num++
    await autoAuthSlider(url, num, page)
  } else {
    console.log(`验证成功：${url}`)
  }
}

async function isAuthPage(page = page1) {
  return await page.evaluate(() =>
    document.body.innerHTML?.includes('window.Tracker')
  )
}

module.exports = homeApi
