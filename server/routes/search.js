const router = require('koa-router')()
const txApi = require('../api/tx')

const apiMap = {
  tx: txApi,
}

router.prefix('/video/search')

router.get('/', async (ctx) => {
  const { type = 'tx', keyword } = ctx.query
  const data = await apiMap[type].search(keyword)
  ctx.body = data
})

module.exports = router
