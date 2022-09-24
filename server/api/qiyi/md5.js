const md5 = function (t) {
  t += ''
  var e,
    r,
    n,
    o,
    i,
    a,
    u,
    s,
    c,
    l = []
  for (
    t = (function (t) {
      // eslint-disable-next-line no-control-regex
      t = t.replace(/\x0d\x0a/g, '\n')
      for (var e = '', r = 0; r < t.length; r++) {
        var n = t.charCodeAt(r)
        n < 128
          ? (e += String.fromCharCode(n))
          : n > 127 && n < 2048
          ? ((e += String.fromCharCode((n >> 6) | 192)),
            (e += String.fromCharCode((63 & n) | 128)))
          : ((e += String.fromCharCode((n >> 12) | 224)),
            (e += String.fromCharCode(((n >> 6) & 63) | 128)),
            (e += String.fromCharCode((63 & n) | 128)))
      }
      return e
    })(t),
      l = (function (t) {
        for (
          var e,
            r = t.length,
            n = r + 8,
            o = 16 * ((n - (n % 64)) / 64 + 1),
            i = Array(o - 1),
            a = 0,
            u = 0;
          u < r;

        )
          (a = (u % 4) * 8),
            (i[(e = (u - (u % 4)) / 4)] = i[e] | (t.charCodeAt(u) << a)),
            u++
        return (
          (a = (u % 4) * 8),
          (i[(e = (u - (u % 4)) / 4)] = i[e] | (128 << a)),
          (i[o - 2] = r << 3),
          (i[o - 1] = r >>> 29),
          i
        )
      })(t),
      a = 1732584193,
      u = 4023233417,
      s = 2562383102,
      c = 271733878,
      e = 0;
    e < l.length;
    e += 16
  )
    (r = a),
      (n = u),
      (o = s),
      (i = c),
      (a = w(a, u, s, c, l[e + 0], 7, 3614090360)),
      (c = w(c, a, u, s, l[e + 1], 12, 3905402710)),
      (s = w(s, c, a, u, l[e + 2], 17, 606105819)),
      (u = w(u, s, c, a, l[e + 3], 22, 3250441966)),
      (a = w(a, u, s, c, l[e + 4], 7, 4118548399)),
      (c = w(c, a, u, s, l[e + 5], 12, 1200080426)),
      (s = w(s, c, a, u, l[e + 6], 17, 2821735955)),
      (u = w(u, s, c, a, l[e + 7], 22, 4249261313)),
      (a = w(a, u, s, c, l[e + 8], 7, 1770035416)),
      (c = w(c, a, u, s, l[e + 9], 12, 2336552879)),
      (s = w(s, c, a, u, l[e + 10], 17, 4294925233)),
      (u = w(u, s, c, a, l[e + 11], 22, 2304563134)),
      (a = w(a, u, s, c, l[e + 12], 7, 1804603682)),
      (c = w(c, a, u, s, l[e + 13], 12, 4254626195)),
      (s = w(s, c, a, u, l[e + 14], 17, 2792965006)),
      (u = w(u, s, c, a, l[e + 15], 22, 1236535329)),
      (a = x(a, u, s, c, l[e + 1], 5, 4129170786)),
      (c = x(c, a, u, s, l[e + 6], 9, 3225465664)),
      (s = x(s, c, a, u, l[e + 11], 14, 643717713)),
      (u = x(u, s, c, a, l[e + 0], 20, 3921069994)),
      (a = x(a, u, s, c, l[e + 5], 5, 3593408605)),
      (c = x(c, a, u, s, l[e + 10], 9, 38016083)),
      (s = x(s, c, a, u, l[e + 15], 14, 3634488961)),
      (u = x(u, s, c, a, l[e + 4], 20, 3889429448)),
      (a = x(a, u, s, c, l[e + 9], 5, 568446438)),
      (c = x(c, a, u, s, l[e + 14], 9, 3275163606)),
      (s = x(s, c, a, u, l[e + 3], 14, 4107603335)),
      (u = x(u, s, c, a, l[e + 8], 20, 1163531501)),
      (a = x(a, u, s, c, l[e + 13], 5, 2850285829)),
      (c = x(c, a, u, s, l[e + 2], 9, 4243563512)),
      (s = x(s, c, a, u, l[e + 7], 14, 1735328473)),
      (u = x(u, s, c, a, l[e + 12], 20, 2368359562)),
      (a = E(a, u, s, c, l[e + 5], 4, 4294588738)),
      (c = E(c, a, u, s, l[e + 8], 11, 2272392833)),
      (s = E(s, c, a, u, l[e + 11], 16, 1839030562)),
      (u = E(u, s, c, a, l[e + 14], 23, 4259657740)),
      (a = E(a, u, s, c, l[e + 1], 4, 2763975236)),
      (c = E(c, a, u, s, l[e + 4], 11, 1272893353)),
      (s = E(s, c, a, u, l[e + 7], 16, 4139469664)),
      (u = E(u, s, c, a, l[e + 10], 23, 3200236656)),
      (a = E(a, u, s, c, l[e + 13], 4, 681279174)),
      (c = E(c, a, u, s, l[e + 0], 11, 3936430074)),
      (s = E(s, c, a, u, l[e + 3], 16, 3572445317)),
      (u = E(u, s, c, a, l[e + 6], 23, 76029189)),
      (a = E(a, u, s, c, l[e + 9], 4, 3654602809)),
      (c = E(c, a, u, s, l[e + 12], 11, 3873151461)),
      (s = E(s, c, a, u, l[e + 15], 16, 530742520)),
      (u = E(u, s, c, a, l[e + 2], 23, 3299628645)),
      (a = S(a, u, s, c, l[e + 0], 6, 4096336452)),
      (c = S(c, a, u, s, l[e + 7], 10, 1126891415)),
      (s = S(s, c, a, u, l[e + 14], 15, 2878612391)),
      (u = S(u, s, c, a, l[e + 5], 21, 4237533241)),
      (a = S(a, u, s, c, l[e + 12], 6, 1700485571)),
      (c = S(c, a, u, s, l[e + 3], 10, 2399980690)),
      (s = S(s, c, a, u, l[e + 10], 15, 4293915773)),
      (u = S(u, s, c, a, l[e + 1], 21, 2240044497)),
      (a = S(a, u, s, c, l[e + 8], 6, 1873313359)),
      (c = S(c, a, u, s, l[e + 15], 10, 4264355552)),
      (s = S(s, c, a, u, l[e + 6], 15, 2734768916)),
      (u = S(u, s, c, a, l[e + 13], 21, 1309151649)),
      (a = S(a, u, s, c, l[e + 4], 6, 4149444226)),
      (c = S(c, a, u, s, l[e + 11], 10, 3174756917)),
      (s = S(s, c, a, u, l[e + 2], 15, 718787259)),
      (u = S(u, s, c, a, l[e + 9], 21, 3951481745)),
      (a = p(a, r)),
      (u = p(u, n)),
      (s = p(s, o)),
      (c = p(c, i))
  return (b(a) + b(u) + b(s) + b(c)).toLowerCase()
}

const getSign = function () {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
    n = e.splitKey,
    r = void 0 === n ? '&' : n,
    o = e.secretKey,
    c = void 0 === o ? 'howcuteitis' : o,
    l = e.key,
    d = void 0 === l ? 'secret_key' : l,
    h = Object.keys(t).sort(),
    v = h.map(function (e) {
      return ''.concat(e, '=').concat(t[e])
    })
  return v.push(''.concat(d, '=').concat(c)), md5(v.join(r))
}

function w(t, e, r, n, o, i, a) {
  return (
    (t = p(
      t,
      p(
        p(
          (function (t, e, r) {
            return (t & e) | (~t & r)
          })(e, r, n),
          o
        ),
        a
      )
    )),
    p(v(t, i), e)
  )
}

function p(t, e) {
  var r, n, o, i, a
  return (
    (o = 2147483648 & t),
    (i = 2147483648 & e),
    (a = (1073741823 & t) + (1073741823 & e)),
    (r = 1073741824 & t) & (n = 1073741824 & e)
      ? 2147483648 ^ a ^ o ^ i
      : r | n
      ? 1073741824 & a
        ? 3221225472 ^ a ^ o ^ i
        : 1073741824 ^ a ^ o ^ i
      : a ^ o ^ i
  )
}

function x(t, e, r, n, o, i, a) {
  return (
    (t = p(
      t,
      p(
        p(
          (function (t, e, r) {
            return (t & r) | (e & ~r)
          })(e, r, n),
          o
        ),
        a
      )
    )),
    p(v(t, i), e)
  )
}

function E(t, e, r, n, o, i, a) {
  return (
    (t = p(
      t,
      p(
        p(
          (function (t, e, r) {
            return t ^ e ^ r
          })(e, r, n),
          o
        ),
        a
      )
    )),
    p(v(t, i), e)
  )
}

function S(t, e, r, n, o, i, a) {
  return (
    (t = p(
      t,
      p(
        p(
          (function (t, e, r) {
            return e ^ (t | ~r)
          })(e, r, n),
          o
        ),
        a
      )
    )),
    p(v(t, i), e)
  )
}

function b(t) {
  var e,
    r = '',
    n = ''
  for (e = 0; e <= 3; e++)
    r += (n = '0' + ((t >>> (8 * e)) & 255).toString(16)).substr(
      n.length - 2,
      2
    )
  return r
}

function v(t, e) {
  return (t << e) | (t >>> (32 - e))
}

module.exports = {
  md5,
  getSign,
}
