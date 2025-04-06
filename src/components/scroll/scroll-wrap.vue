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

const props = withDefaults(defineProps<Props>(), {
  click: true,
  probeType: 0,
  scrollX: false,
  scrollY: true,
})
const emit = defineEmits<Emits>()
const rootRef = useTemplateRef<HTMLElement>('rootRef')
const scroll = useScroll(rootRef, props, emit)

defineExpose({
  scroll,
})
</script>
