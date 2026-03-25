import type { SessionStats } from './stats.types'
import type { SessionStatus } from './session.types'

export interface TickResult {
  draw: number[]
  playerNumbers: number[]
  matchCount: number
  drawNumber: number
  stats: SessionStats
  status: SessionStatus
}
