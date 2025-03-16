import { Site } from '@/types/enum'

export function px2vw(size: number, decimal = 0) {
  const width =
    document.documentElement.clientWidth || document.body.clientWidth
  const nSize = size * (width / 414)
  return round(nSize, decimal)
}

export function round(num: number, decimal: number) {
  if (isNaN(num)) {
    return 0
  }
  const p1 = Math.pow(10, decimal + 1)
  const p2 = Math.pow(10, decimal)
  return Math.round((num * p1) / 10) / p2
}

export function getImageUrl(name: string) {
  return new URL(`../assets/images/${name}`, import.meta.url).href
}

export function getAssetsUrl(name: string) {
  return new URL(`../assets/${name}`, import.meta.url).href
}

export function setTitle(title: string) {
  const defTitle = 'xiaopengyaa视频'
  return title ? `${title} - ${defTitle}` : defTitle
}

export function getSiteLogo(site: Site) {
  const logoMap = {
    [Site.qq]: getImageUrl('qq.png'),
    [Site.qiyi]: getImageUrl('qiyi.png'),
    [Site.youku]: getImageUrl('youku.png'),
    [Site.migu]: getImageUrl('migu.png'),
    [Site.yangshipin]: getImageUrl('yangshipin.png'),
    [Site.cntv]: getImageUrl('cntv.png'),
    [Site.vip1905]: getImageUrl('1905.png'),
    [Site.hunantv]: getImageUrl('hunantv.png'),
    [Site.letv]: getImageUrl('letv.png'),
    [Site.pptv]: getImageUrl('pptv.png'),
    [Site.acfun]: getImageUrl('acfun.png'),
    [Site.bilibili]: getImageUrl('bilibili.png'),
    [Site.sohu]: getImageUrl('sohu.png'),
  }
  return logoMap[site] || ''
}

export function restoreHtmlText(str: string) {
  return str.replace(/<span\sclass="main">(.*?)<\/span>/g, '$1')
}

export function stopBodyScroll(isFixed: boolean) {
  if (isFixed) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}
