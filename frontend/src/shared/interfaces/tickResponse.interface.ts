import type { SessionStats } from './sessionStats.interface'
import type { SessionStatus } from '../types/sessionStatus.types'

export interface TickResponse {
  drawNumber: number
  playerNumbers: number[]
  draw: number[]
  matchCount: number
  stats: SessionStats
  status: Exclude<SessionStatus, 'idle' | 'running'>
}
