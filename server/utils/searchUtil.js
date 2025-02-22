function generateUuid(e, t) {
  const i =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        ''
      ),
    r = []
  let o
  i.length
  {
    let e
    for (r[8] = r[13] = r[18] = r[23] = '-', r[14] = '4', o = 0; o < 36; o += 1)
      r[o] ||
        ((e = 0 | (16 * Math.random())), (r[o] = i[19 === o ? (3 & e) | 8 : e]))
  }
  return r.join('')
}

module.exports = {
  generateUuid,
}
