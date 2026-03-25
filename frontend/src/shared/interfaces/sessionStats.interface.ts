import type { WinsBreakdown } from './winsBreakdown.interface'

export interface SessionStats {
  tickets: number
  yearsElapsed: number
  totalCost: number
  wins: WinsBreakdown
}
