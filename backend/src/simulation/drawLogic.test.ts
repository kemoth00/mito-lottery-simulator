import { describe, it, expect } from 'vitest'
import {
  generateNumbers,
  countMatches,
  validatePlayerNumbers,
  NUMBERS_COUNT,
  MIN_NUMBER,
  MAX_NUMBER,
} from './drawLogic'

describe('generateNumbers', () => {
  it('returns exactly NUMBERS_COUNT numbers', () => {
    expect(generateNumbers()).toHaveLength(NUMBERS_COUNT)
  })

  it('returns unique numbers', () => {
    const nums = generateNumbers()
    expect(new Set(nums).size).toBe(NUMBERS_COUNT)
  })

  it('returns numbers within [MIN_NUMBER, MAX_NUMBER]', () => {
    // Run several times to reduce flakiness
    for (let i = 0; i < 20; i++) {
      generateNumbers().forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(MIN_NUMBER)
        expect(n).toBeLessThanOrEqual(MAX_NUMBER)
      })
    }
  })

  it('returns numbers sorted in strictly ascending order', () => {
    for (let i = 0; i < 10; i++) {
      const nums = generateNumbers()
      for (let j = 1; j < nums.length; j++) {
        expect(nums[j]).toBeGreaterThan(nums[j - 1])
      }
    }
  })
})

describe('countMatches', () => {
  it('counts all matches when arrays are identical', () => {
    expect(countMatches([1, 2, 3, 4, 5], [1, 2, 3, 4, 5])).toBe(5)
  })

  it('returns 0 when no numbers match', () => {
    expect(countMatches([1, 2, 3, 4, 5], [6, 7, 8, 9, 10])).toBe(0)
  })

  it('counts partial matches correctly', () => {
    expect(countMatches([1, 2, 3, 4, 5], [1, 2, 10, 20, 30])).toBe(2)
    expect(countMatches([10, 20, 30, 40, 50], [10, 20, 30, 60, 70])).toBe(3)
  })
})

describe('validatePlayerNumbers', () => {
  it('accepts valid strictly increasing numbers in range', () => {
    expect(validatePlayerNumbers([3, 14, 33, 67, 81])).toBe(true)
    expect(validatePlayerNumbers([1, 2, 3, 4, 90])).toBe(true)
  })

  it('rejects arrays with wrong length', () => {
    expect(validatePlayerNumbers([1, 2, 3])).toBe(false)
    expect(validatePlayerNumbers([1, 2, 3, 4, 5, 6])).toBe(false)
  })

  it('rejects numbers below MIN_NUMBER', () => {
    expect(validatePlayerNumbers([0, 2, 3, 4, 5])).toBe(false)
  })

  it('rejects numbers above MAX_NUMBER', () => {
    expect(validatePlayerNumbers([1, 2, 3, 4, 91])).toBe(false)
  })

  it('rejects duplicate numbers', () => {
    expect(validatePlayerNumbers([5, 5, 10, 20, 30])).toBe(false)
  })

  it('rejects non-ascending numbers', () => {
    expect(validatePlayerNumbers([10, 5, 20, 30, 40])).toBe(false)
  })
})
