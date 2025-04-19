import { stopBodyScroll } from '@/utils/common'
import { useBaseStore } from '@/store/base'

export function useLockScroll() {
  const baseStore = useBaseStore()

  watchEffect(() => {
    baseStore.isLock ? stopBodyScroll(true) : stopBodyScroll(false)
  })

  onMounted(() => {
    baseStore.isLock = true
  })

  onUnmounted(() => {
    baseStore.isLock = false
  })
}
