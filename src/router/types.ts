import type { RouteLocationNormalized } from 'vue-router'

export type EnhancedRouteLocation = RouteLocationNormalized & {
  meta: {
    title?: string
    name?: string
    keepAlive?: boolean
  }
}
