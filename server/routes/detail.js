const router = require('koa-router')()
const qqApi = require('../api/qq/detail')
const bilibiliApi = require('../api/bilibili/detail')
const qiyiApi = require('../api/qiyi/detail')
const defaultApi = require('../api/default/detail')
const { SITE } = require('../utils/constant')

const apiMap = {
  [SITE.qq]: qqApi,
  [SITE.bilibili]: bilibiliApi,
  [SITE.qiyi]: qiyiApi,
}

router.prefix('/video/api/detail')

router.get('/getDetail', async (ctx) => {
  const { site } = ctx.query
  const obj = apiMap[site] || defaultApi
  const data = await obj.getDetail(ctx.query)
  ctx.body = data
})

router.get('/getPlaylist', async (ctx) => {
  const { site } = ctx.query
  const obj = apiMap[site] || defaultApi
  const data = await obj.getPlaylist(ctx.query, 0)
  ctx.body = data
})

module.exports = router
