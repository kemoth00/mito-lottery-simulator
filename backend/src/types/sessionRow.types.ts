import type { PlayerMode, SessionStatus } from './session.types'
import type { SessionStats } from './stats.types'

/** Matches the DB row shape (snake_case column names) */
export interface SessionRow {
  id: string
  player_mode: PlayerMode
  player_numbers: number[] | null
  draw_number: number
  stats: SessionStats
  status: SessionStatus
  started_at: Date
  ended_at: Date | null
}
