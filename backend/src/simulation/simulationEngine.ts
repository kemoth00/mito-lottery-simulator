import { generateNumbers, countMatches } from './drawLogic'
import type { SessionRow, SessionStats, SessionStatus, TickResult, WinsBreakdown } from '../types'

export const MAX_DRAWS = 26_000 // ~500 years (52 weeks × 500)
export const TICKET_PRICE = 300 // HUF
export const DRAWS_PER_YEAR = 52

/**
 * Pure function: derives the next stats snapshot from the current stats,
 * the upcoming draw number, and how many numbers matched.
 */
export function calculateNextStats(
  prevStats: SessionStats,
  nextDrawNumber: number,
  matchCount: number,
): SessionStats {
  const wins: WinsBreakdown = { ...prevStats.wins }
  if (matchCount >= 2 && matchCount <= 5) {
    const key = String(matchCount) as keyof WinsBreakdown
    wins[key] = wins[key] + 1
  }
  return {
    tickets: nextDrawNumber,
    yearsElapsed: Math.floor(nextDrawNumber / DRAWS_PER_YEAR),
    totalCost: nextDrawNumber * TICKET_PRICE,
    wins,
  }
}

/**
 * Pure function: determines the session status after a draw.
 * Jackpot takes priority over reaching the draw limit.
 */
export function determineStatus(nextDrawNumber: number, matchCount: number): SessionStatus {
  if (matchCount === 5) return 'jackpot'
  if (nextDrawNumber >= MAX_DRAWS) return 'max_draws_reached'
  return 'active'
}

/**
 * Runs a single simulation tick against the given session state.
 * Stateless — all side effects (DB writes) are handled by the caller.
 */
export function runTick(session: SessionRow): TickResult {
  const playerNumbers =
    session.playerMode === 'random' ? generateNumbers() : session.playerNumbers

  const draw = generateNumbers()
  const matchCount = countMatches(playerNumbers, draw)
  const nextDrawNumber = session.drawNumber + 1

  const stats = calculateNextStats(session.stats, nextDrawNumber, matchCount)
  const status = determineStatus(nextDrawNumber, matchCount)

  return { draw, playerNumbers, matchCount, drawNumber: nextDrawNumber, stats, status }
}
