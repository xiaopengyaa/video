const router = require('koa-router')()
const qqApi = require('../api/qq/detail')

const apiMap = {
  qq: qqApi,
}

router.prefix('/video/api/detail')

router.get('/getDetail', async (ctx) => {
  const { site = 'qq', url } = ctx.query
  const data = await apiMap[site].getDetail(url)
  ctx.body = data
})

router.get('/getPlaylist', async (ctx) => {
  const { site = 'qq', cid } = ctx.query
  const data = await apiMap[site].getPlaylist(cid, 0)
  ctx.body = data
})

module.exports = router
