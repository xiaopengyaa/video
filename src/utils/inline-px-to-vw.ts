import { round } from 'lodash-es'

// 理想宽度，设计稿的宽度
const idealWidth = 375

// 表示伸缩视图的最大宽度
const maxWidth = 600

/**
 * 限制大小的 vw 转换
 * @param {number} n
 */
export default function vw(n: number) {
  if (n === 0)
    return n

  const vwN = round(n * 100 / idealWidth, 3)
  const maxN = round(n * maxWidth / idealWidth, 3)
  const cssF = n > 0 ? 'min' : 'max'
  return `${cssF}(${vwN}vw, ${maxN}px)`
}
