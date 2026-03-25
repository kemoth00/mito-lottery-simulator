import { create } from 'zustand'
import type { SessionStats, StatsState, WinsBreakdown } from '../../../shared/interfaces'

const INITIAL_WINS: WinsBreakdown = { '2': 0, '3': 0, '4': 0, '5': 0 }

export const INITIAL_STATS: SessionStats = {
  tickets: 0,
  yearsElapsed: 0,
  totalCost: 0,
  wins: INITIAL_WINS,
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: INITIAL_STATS,

  setStats(stats) {
    set({ stats })
  },

  reset() {
    set({ stats: INITIAL_STATS })
  },
}))
