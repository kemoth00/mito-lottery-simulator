import type { SessionStats } from './sessionStats.types'

export const INITIAL_STATS: SessionStats = {
  tickets: 0,
  yearsElapsed: 0,
  totalCost: 0,
  wins: { '2': 0, '3': 0, '4': 0, '5': 0 },
}
