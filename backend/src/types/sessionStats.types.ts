import type { WinsBreakdown } from './winsBreakdown.types'

export interface SessionStats {
  tickets: number
  yearsElapsed: number
  totalCost: number
  wins: WinsBreakdown
}
