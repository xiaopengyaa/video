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
