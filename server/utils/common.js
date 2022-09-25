const { SITE } = require('./constant')

module.exports = {
  getResult(result, code = 0) {
    return {
      code,
      result,
    }
  },
  addChineseUnit,
  getSiteByUrl(url) {
    let site = SITE.qq
    Object.values(SITE).forEach((value) => {
      if (url.includes(value)) {
        site = value
      }
    })
    return site
  },
  getImageUrl(url) {
    if (url) {
      return url.replace(/^(http)[s]*(:\/\/)/, 'https://images.weserv.nl/?url=')
    }
    return url
  },
  dedupe(array) {
    return Array.from(new Set(array))
  },
}

/**
 * 为数字加上单位：万或亿
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
function addChineseUnit(number, decimalDigit) {
  decimalDigit = decimalDigit == null ? 2 : decimalDigit
  const integer = Math.floor(number)
  const digit = getDigit(integer)
  // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
  const unit = []
  if (digit > 3) {
    const multiple = Math.floor(digit / 8)
    if (multiple >= 1) {
      const tmp = Math.round(integer / Math.pow(10, 8 * multiple))
      unit.push(addWan(tmp, number, 8 * multiple, decimalDigit))
      for (let i = 0; i < multiple; i++) {
        unit.push('亿')
      }
      return unit.join('')
    } else {
      return addWan(integer, number, 0, decimalDigit)
    }
  } else {
    return number
  }
}

function addWan(integer, number, mutiple, decimalDigit) {
  const digit = getDigit(integer)
  if (digit > 3) {
    let remainder = digit % 8
    if (remainder >= 5) {
      // ‘十万’、‘百万’、‘千万’显示为‘万’
      remainder = 4
    }
    return (
      Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) /
        Math.pow(10, decimalDigit) +
      '万'
    )
  } else {
    return (
      Math.round(number / Math.pow(10, mutiple - decimalDigit)) /
      Math.pow(10, decimalDigit)
    )
  }
}

function getDigit(integer) {
  let digit = -1
  while (integer >= 1) {
    digit++
    integer = integer / 10
  }
  return digit
}
