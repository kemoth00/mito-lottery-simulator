import type { PlayerMode } from './playerMode.types'
import type { SessionStatus } from './sessionStatus.types'
import type { SessionStats } from './sessionStats.types'

/** Matches the Prisma model shape (camelCase field names) */
export interface SessionRow {
  id: string
  playerMode: PlayerMode
  playerNumbers: number[]
  drawNumber: number
  stats: SessionStats
  status: SessionStatus
  startedAt: Date
  endedAt: Date | null
}
