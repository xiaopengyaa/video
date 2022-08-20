const router = require('koa-router')()
const txApi = require('../api/tx/detail')

const apiMap = {
  tx: txApi,
}

router.prefix('/video/detail')

router.get('/getDetail', async (ctx) => {
  const { type = 'tx', url } = ctx.query
  const data = await apiMap[type].getDetail(url)
  ctx.body = data
})

router.get('/getPlaylist', async (ctx) => {
  const { type = 'tx' } = ctx.query
  const data = await apiMap[type].getPlaylist('m441e3rjq9kwpsc', 0)
  ctx.body = data
})

module.exports = router
