<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import useScroll from './use-scroll'

interface Emits {
  (event: 'scroll', ...args: unknown[]): void
}
interface Props {
  click?: boolean
  probeType?: number
  scrollX?: boolean
  scrollY?: boolean
}

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  click: true,
  probeType: 0,
  scrollX: false,
  scrollY: true,
})

const rootRef = ref<HTMLElement | null>(null)
const scroll = useScroll(rootRef, props, emit)

defineExpose({
  scroll,
})
</script>
