export interface WinsBreakdown {
  '2': number
  '3': number
  '4': number
  '5': number
}

export interface SessionStats {
  tickets: number
  yearsElapsed: number
  totalCost: number
  wins: WinsBreakdown
}

export const INITIAL_STATS: SessionStats = {
  tickets: 0,
  yearsElapsed: 0,
  totalCost: 0,
  wins: { '2': 0, '3': 0, '4': 0, '5': 0 },
}
