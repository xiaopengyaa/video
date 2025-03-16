const browser = {
  versions: (function () {
    const u = navigator.userAgent
    return {
      // 移动终端浏览器版本信息
      trident: u.includes('Trident'), // IE内核
      presto: u.includes('Presto'), // opera内核
      webKit: u.includes('AppleWebKit'), // 苹果、谷歌内核
      gecko: u.includes('Gecko') && !u.includes('KHTML'), // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.includes('Android') || u.includes('Linux'), // android终端或uc浏览器
      iPhone: u.includes('iPhone'), // 是否为iPhone或者QQHD浏览器
      iPad: u.includes('iPad'), // 是否iPad
      webApp: !u.includes('Safari'), // 是否web应该程序，没有头部与底部
    }
  })(),
}

export default browser
