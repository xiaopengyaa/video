import { addHistory, clearHistory, deleteHistory, getHistoryList, updateHistory } from '@/api/history'
import type { HistoryItem, UpdateHistoryParams } from '@/types/history'

export const useHistoryStore = defineStore('history', () => {
  const page = ref(1)
  const pageSize = ref(10)
  const historyTotal = ref(0)
  const historyList = ref<HistoryItem[]>([])
  const loading = ref(false)

  // 获取历史记录列表
  async function getHistoryListAction() {
    loading.value = true
    try {
      const { list, total } = await getHistoryList({ page: page.value, pageSize: pageSize.value })

      if (page.value === 1) {
        historyList.value = list
      }
      else {
        historyList.value.push(...list)
      }

      historyTotal.value = total
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  // 添加历史记录
  async function addHistoryAction(params: UpdateHistoryParams) {
    loading.value = true
    try {
      await addHistory(params)
      page.value = 1
      await getHistoryListAction()
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  // 更新历史记录
  async function updateHistoryAction(params: UpdateHistoryParams) {
    loading.value = true
    try {
      await updateHistory(params)
      page.value = 1
      await getHistoryListAction()
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  // 删除历史记录
  async function deleteHistoryAction(id: string) {
    loading.value = true
    try {
      await deleteHistory(id)
      page.value = 1
      await getHistoryListAction()
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  // 清空历史记录
  async function clearHistoryAction() {
    loading.value = true
    try {
      await clearHistory()
      historyList.value = []
      historyTotal.value = 0
      page.value = 1
      return true
    }
    catch (error) {
      return false
    }
    finally {
      loading.value = false
    }
  }

  return {
    historyList,
    historyTotal,
    loading,
    page,
    pageSize,
    getHistoryListAction,
    addHistoryAction,
    updateHistoryAction,
    deleteHistoryAction,
    clearHistoryAction,
  }
})
