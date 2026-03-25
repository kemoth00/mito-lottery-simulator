import type { SessionStats } from './sessionStats.types'
import type { SessionStatus } from './sessionStatus.types'

export interface TickResult {
  draw: number[]
  playerNumbers: number[]
  matchCount: number
  drawNumber: number
  stats: SessionStats
  status: SessionStatus
}
