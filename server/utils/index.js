const api = require('./axios') // api封装
const common = require('./common')
const utils = {
  api,
  ...common,
}

module.exports = utils
