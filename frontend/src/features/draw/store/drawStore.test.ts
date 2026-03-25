import { beforeEach, describe, it, expect } from 'vitest'
import { useDrawStore } from './drawStore'

beforeEach(() => {
  useDrawStore.getState().reset()
})

describe('drawStore — initial state', () => {
  it('starts with an empty current draw', () => {
    expect(useDrawStore.getState().currentDraw).toEqual([])
  })

  it('starts with empty player numbers', () => {
    expect(useDrawStore.getState().currentPlayerNumbers).toEqual([])
  })

  it('starts with a match count of 0', () => {
    expect(useDrawStore.getState().matchCount).toBe(0)
  })
})

describe('drawStore — setDraw', () => {
  it('stores the draw, player numbers and match count', () => {
    useDrawStore.getState().setDraw([5, 14, 33, 55, 81], [5, 14, 20, 40, 81], 3)
    const { currentDraw, currentPlayerNumbers, matchCount } = useDrawStore.getState()
    expect(currentDraw).toEqual([5, 14, 33, 55, 81])
    expect(currentPlayerNumbers).toEqual([5, 14, 20, 40, 81])
    expect(matchCount).toBe(3)
  })

  it('overwrites a previous draw on subsequent calls', () => {
    useDrawStore.getState().setDraw([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], 5)
    useDrawStore.getState().setDraw([10, 20, 30, 40, 50], [1, 2, 3, 4, 5], 0)
    expect(useDrawStore.getState().currentDraw).toEqual([10, 20, 30, 40, 50])
    expect(useDrawStore.getState().matchCount).toBe(0)
  })
})

describe('drawStore — reset', () => {
  it('clears all state back to initial values', () => {
    useDrawStore.getState().setDraw([1, 2, 3, 4, 5], [6, 7, 8, 9, 10], 0)
    useDrawStore.getState().reset()
    const { currentDraw, currentPlayerNumbers, matchCount } = useDrawStore.getState()
    expect(currentDraw).toEqual([])
    expect(currentPlayerNumbers).toEqual([])
    expect(matchCount).toBe(0)
  })
})
