const router = require('koa-router')()
const qqApi = require('../api/qq/detail')
const bilibiliApi = require('../api/bilibili/detail')
const qiyiApi = require('../api/qiyi/detail')
const hunantvApi = require('../api/hunantv/detail')
const defaultApi = require('../api/default/detail')
const { SITE } = require('../utils/constant')

const apiMap = {
  [SITE.qq]: qqApi,
  [SITE.hunantv]: hunantvApi,
  // [SITE.bilibili]: bilibiliApi,
  // [SITE.qiyi]: qiyiApi,
}

router.prefix('/video/api/detail')

router.get('/getDetail', async (ctx) => {
  const { site } = ctx.query
  const obj = apiMap[site] || defaultApi
  const data = await obj.getDetail(ctx.query)
  ctx.body = data
})

router.post('/getPlaylist', async (ctx) => {
  const { site } = ctx.request.body
  const obj = apiMap[site] || defaultApi
  const data = await obj.getPlaylist(ctx.request.body)
  ctx.body = data
})

module.exports = router
