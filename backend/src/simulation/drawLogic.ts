import { randomInt } from 'crypto'

export const NUMBERS_COUNT = 5
export const MIN_NUMBER = 1
export const MAX_NUMBER = 90

/**
 * Generates NUMBERS_COUNT unique random numbers in [MIN_NUMBER, MAX_NUMBER],
 * sorted ascending. Uses crypto.randomInt for cryptographic quality randomness.
 */
export function generateNumbers(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < NUMBERS_COUNT) {
    numbers.add(randomInt(MIN_NUMBER, MAX_NUMBER + 1))
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

/** Returns the number of values that appear in both arrays. */
export function countMatches(playerNumbers: number[], drawNumbers: number[]): number {
  const drawSet = new Set(drawNumbers)
  return playerNumbers.filter((n) => drawSet.has(n)).length
}

/**
 * Validates that numbers are:
 * - exactly NUMBERS_COUNT long
 * - each in [MIN_NUMBER, MAX_NUMBER]
 * - strictly increasing (unique by implication)
 */
export function validatePlayerNumbers(numbers: number[]): boolean {
  if (numbers.length !== NUMBERS_COUNT) return false
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < MIN_NUMBER || numbers[i] > MAX_NUMBER) return false
    if (i > 0 && numbers[i] <= numbers[i - 1]) return false
  }
  return true
}
