import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import type { Options } from '@better-scroll/core'
import type { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import type { Position } from '@better-scroll/slide/dist/types/SlidePages'
import type { ShallowRef } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(
  wrapperRef: ShallowRef<HTMLElement | null>,
  options: Options,
  emit: (event: 'scroll', ...args: unknown[]) => void,
) {
  const scroll = shallowRef<BScrollConstructor | null>(null)

  onMounted(() => {
    if (!wrapperRef.value || wrapperRef.value.clientHeight === 0) {
      return
    }
    scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      useTransition: false,
      ...options,
    })
    const scrollVal = scroll.value

    if (Number(options.probeType) > 0) {
      scrollVal.on('scroll', (pos: Position) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value?.destroy()
  })

  onActivated(() => {
    scroll.value?.enable()
    scroll.value?.refresh()
  })

  onDeactivated(() => {
    scroll.value?.disable()
  })

  return scroll
}
