import type { Site } from './enum'

export interface HistoryItem {
  episodeId: string
  episodeName: string
  episodePoster: string
  id: string
  lastWatchTime: string
  totalDuration: number
  userId: string
  videoId: string
  videoSite: string
  videoText: string
  videoUrl: string
  watchProgress: number
}

export interface UpdateHistoryParams {
  videoId: string
  videoUrl: string
  videoSite: Site
  videoText: string
  episodeId: string
  episodeName: string
  episodePoster: string
  watchProgress: number
  totalDuration: number
}
