import { beforeEach, describe, it, expect } from 'vitest'
import { usePlayerStore } from './playerStore'

beforeEach(() => {
  usePlayerStore.getState().reset()
})

describe('playerStore — initial state', () => {
  it('starts in random mode', () => {
    expect(usePlayerStore.getState().mode).toBe('random')
  })

  it('starts with no selected numbers', () => {
    expect(usePlayerStore.getState().selectedNumbers).toEqual([])
  })
})

describe('playerStore — setMode', () => {
  it('switches to fixed mode', () => {
    usePlayerStore.getState().setMode('fixed')
    expect(usePlayerStore.getState().mode).toBe('fixed')
  })

  it('clears selected numbers when mode changes', () => {
    usePlayerStore.getState().setMode('fixed')
    usePlayerStore.getState().toggleNumber(10)
    usePlayerStore.getState().setMode('random')
    expect(usePlayerStore.getState().selectedNumbers).toEqual([])
  })
})

describe('playerStore — toggleNumber', () => {
  it('adds a number to the selection', () => {
    usePlayerStore.getState().toggleNumber(7)
    expect(usePlayerStore.getState().selectedNumbers).toContain(7)
  })

  it('removes a number that is already selected', () => {
    usePlayerStore.getState().toggleNumber(7)
    usePlayerStore.getState().toggleNumber(7)
    expect(usePlayerStore.getState().selectedNumbers).not.toContain(7)
  })

  it('keeps selected numbers sorted in ascending order', () => {
    usePlayerStore.getState().toggleNumber(50)
    usePlayerStore.getState().toggleNumber(10)
    usePlayerStore.getState().toggleNumber(30)
    const nums = usePlayerStore.getState().selectedNumbers
    expect(nums).toEqual([10, 30, 50])
  })

  it('does not exceed MAX_PLAYER_NUMBERS (5)', () => {
    ;[1, 2, 3, 4, 5].forEach((n) => usePlayerStore.getState().toggleNumber(n))
    usePlayerStore.getState().toggleNumber(6)
    expect(usePlayerStore.getState().selectedNumbers).toHaveLength(5)
    expect(usePlayerStore.getState().selectedNumbers).not.toContain(6)
  })

  it('allows deselecting when at max capacity', () => {
    ;[1, 2, 3, 4, 5].forEach((n) => usePlayerStore.getState().toggleNumber(n))
    usePlayerStore.getState().toggleNumber(3)
    expect(usePlayerStore.getState().selectedNumbers).toHaveLength(4)
    expect(usePlayerStore.getState().selectedNumbers).not.toContain(3)
  })
})

describe('playerStore — reset', () => {
  it('returns to random mode and empty selection', () => {
    usePlayerStore.getState().setMode('fixed')
    usePlayerStore.getState().toggleNumber(42)
    usePlayerStore.getState().reset()
    const { mode, selectedNumbers } = usePlayerStore.getState()
    expect(mode).toBe('random')
    expect(selectedNumbers).toEqual([])
  })
})
