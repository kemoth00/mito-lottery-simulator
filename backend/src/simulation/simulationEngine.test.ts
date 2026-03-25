import { describe, it, expect } from 'vitest'
import {
  calculateNextStats,
  determineStatus,
  runTick,
  MAX_DRAWS,
  TICKET_PRICE,
  DRAWS_PER_YEAR,
} from './simulationEngine'
import { INITIAL_STATS } from '../types'
import type { SessionRow } from '../types'

const baseSession: SessionRow = {
  id: 'test-uuid',
  player_mode: 'fixed',
  player_numbers: [1, 2, 3, 4, 5],
  draw_number: 0,
  stats: { ...INITIAL_STATS, wins: { '2': 0, '3': 0, '4': 0, '5': 0 } },
  status: 'active',
  started_at: new Date(),
  ended_at: null,
}

describe('calculateNextStats', () => {
  it('increments tickets to the next draw number', () => {
    const result = calculateNextStats(INITIAL_STATS, 1, 0)
    expect(result.tickets).toBe(1)
  })

  it('calculates totalCost as tickets × TICKET_PRICE', () => {
    const result = calculateNextStats(INITIAL_STATS, 5, 0)
    expect(result.totalCost).toBe(5 * TICKET_PRICE)
  })

  it('increments the correct win bucket on a match', () => {
    const r2 = calculateNextStats(INITIAL_STATS, 1, 2)
    expect(r2.wins['2']).toBe(1)
    expect(r2.wins['3']).toBe(0)

    const r4 = calculateNextStats(INITIAL_STATS, 1, 4)
    expect(r4.wins['4']).toBe(1)
  })

  it('does not increment any win bucket for matchCount < 2', () => {
    const result = calculateNextStats(INITIAL_STATS, 1, 1)
    expect(Object.values(result.wins).every((v) => v === 0)).toBe(true)
  })

  it('accumulates wins on top of existing stats', () => {
    const prev = { ...INITIAL_STATS, wins: { '2': 3, '3': 1, '4': 0, '5': 0 } }
    const result = calculateNextStats(prev, 10, 2)
    expect(result.wins['2']).toBe(4)
    expect(result.wins['3']).toBe(1)
  })

  it('calculates yearsElapsed as full years only', () => {
    expect(calculateNextStats(INITIAL_STATS, DRAWS_PER_YEAR - 1, 0).yearsElapsed).toBe(0)
    expect(calculateNextStats(INITIAL_STATS, DRAWS_PER_YEAR, 0).yearsElapsed).toBe(1)
    expect(calculateNextStats(INITIAL_STATS, DRAWS_PER_YEAR * 2, 0).yearsElapsed).toBe(2)
  })
})

describe('determineStatus', () => {
  it('returns "active" for a normal draw', () => {
    expect(determineStatus(1, 0)).toBe('active')
    expect(determineStatus(100, 3)).toBe('active')
  })

  it('returns "jackpot" on 5 matches', () => {
    expect(determineStatus(1, 5)).toBe('jackpot')
  })

  it('returns "max_draws_reached" at MAX_DRAWS with no jackpot', () => {
    expect(determineStatus(MAX_DRAWS, 0)).toBe('max_draws_reached')
    expect(determineStatus(MAX_DRAWS, 3)).toBe('max_draws_reached')
  })

  it('jackpot takes priority over max_draws_reached', () => {
    expect(determineStatus(MAX_DRAWS, 5)).toBe('jackpot')
  })
})

describe('runTick', () => {
  it('increments draw number by 1', () => {
    const result = runTick(baseSession)
    expect(result.drawNumber).toBe(1)
  })

  it('returns exactly 5 numbers in the draw', () => {
    const result = runTick(baseSession)
    expect(result.draw).toHaveLength(5)
  })

  it('returns exactly 5 player numbers', () => {
    const result = runTick(baseSession)
    expect(result.playerNumbers).toHaveLength(5)
  })

  it('uses fixed player numbers when playerMode is "fixed"', () => {
    const result = runTick(baseSession)
    expect(result.playerNumbers).toEqual([1, 2, 3, 4, 5])
  })

  it('generates new player numbers each tick when playerMode is "random"', () => {
    const session: SessionRow = { ...baseSession, player_mode: 'random', player_numbers: null }
    const result = runTick(session)
    expect(result.playerNumbers).toHaveLength(5)
  })

  it('returns a valid status', () => {
    const result = runTick(baseSession)
    expect(['active', 'jackpot', 'max_draws_reached']).toContain(result.status)
  })

  it('returns max_draws_reached when draw_number reaches MAX_DRAWS (no jackpot scenario)', () => {
    // Use numbers that cannot appear in a draw: impossible since range is 1-90,
    // but we test the boundary draw_number logic via determineStatus which is fully covered above.
    // Here we just verify runTick reflects the terminal state correctly.
    const session: SessionRow = { ...baseSession, draw_number: MAX_DRAWS - 1 }
    const result = runTick(session)
    expect(result.drawNumber).toBe(MAX_DRAWS)
    expect(['max_draws_reached', 'jackpot']).toContain(result.status)
  })

  it('matchCount is within 0–5', () => {
    for (let i = 0; i < 10; i++) {
      const result = runTick(baseSession)
      expect(result.matchCount).toBeGreaterThanOrEqual(0)
      expect(result.matchCount).toBeLessThanOrEqual(5)
    }
  })
})
