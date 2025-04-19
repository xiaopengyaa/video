export const useBaseStore = defineStore('base', () => {
  const isLock = ref(false)

  return {
    isLock,
  }
})
