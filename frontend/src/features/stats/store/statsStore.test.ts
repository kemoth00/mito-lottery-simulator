import { beforeEach, describe, it, expect } from 'vitest'
import { useStatsStore, INITIAL_STATS } from './statsStore'

beforeEach(() => {
  useStatsStore.getState().reset()
})

describe('statsStore — initial state', () => {
  it('starts with zero tickets', () => {
    expect(useStatsStore.getState().stats.tickets).toBe(0)
  })

  it('starts with zero years elapsed', () => {
    expect(useStatsStore.getState().stats.yearsElapsed).toBe(0)
  })

  it('starts with zero total cost', () => {
    expect(useStatsStore.getState().stats.totalCost).toBe(0)
  })

  it('starts with all win categories at zero', () => {
    expect(useStatsStore.getState().stats.wins).toEqual({ '2': 0, '3': 0, '4': 0, '5': 0 })
  })
})

describe('statsStore — setStats', () => {
  it('replaces the entire stats object', () => {
    const newStats = {
      tickets: 52,
      yearsElapsed: 1,
      totalCost: 15_600,
      wins: { '2': 3, '3': 1, '4': 0, '5': 0 },
    }
    useStatsStore.getState().setStats(newStats)
    expect(useStatsStore.getState().stats).toEqual(newStats)
  })

  it('reflects a jackpot win', () => {
    const jackpotStats = {
      tickets: 26_000,
      yearsElapsed: 500,
      totalCost: 7_800_000,
      wins: { '2': 200, '3': 20, '4': 2, '5': 1 },
    }
    useStatsStore.getState().setStats(jackpotStats)
    expect(useStatsStore.getState().stats.wins['5']).toBe(1)
  })
})

describe('statsStore — reset', () => {
  it('restores all stats to their initial zero values', () => {
    useStatsStore.getState().setStats({
      tickets: 100,
      yearsElapsed: 2,
      totalCost: 30_000,
      wins: { '2': 5, '3': 1, '4': 0, '5': 0 },
    })
    useStatsStore.getState().reset()
    expect(useStatsStore.getState().stats).toEqual(INITIAL_STATS)
  })
})
