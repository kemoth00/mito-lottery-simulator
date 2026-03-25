import type { SessionStats } from './sessionStats.interface'

export interface StatsState {
  stats: SessionStats
  setStats: (stats: SessionStats) => void
  reset: () => void
}
