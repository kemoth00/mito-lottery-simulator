import { describe, it, expect } from 'vitest'
import { formatSpaced, formatHuf } from './formatters'

describe('formatSpaced', () => {
  it('returns "0" for zero', () => {
    expect(formatSpaced(0)).toBe('0')
  })

  it('returns the raw digits for numbers below 1000', () => {
    expect(formatSpaced(300)).toBe('300')
    expect(formatSpaced(999)).toBe('999')
  })

  it('preserves all digits for large numbers', () => {
    const result = formatSpaced(1_234_567)
    expect(result.replace(/\D/g, '')).toBe('1234567')
  })

  it('produces no comma characters (thousands are space-separated)', () => {
    expect(formatSpaced(1_000_000)).not.toContain(',')
  })
})

describe('formatHuf', () => {
  it('appends the ",00 Ft" Hungarian currency suffix', () => {
    expect(formatHuf(300)).toMatch(/,00 Ft$/)
  })

  it('returns "0,00 Ft" for zero', () => {
    expect(formatHuf(0)).toBe('0,00 Ft')
  })

  it('returns "300,00 Ft" for a single ticket price', () => {
    expect(formatHuf(300)).toBe('300,00 Ft')
  })

  it('preserves all digits for large amounts', () => {
    const result = formatHuf(1_000_000)
    expect(result.replace(/\D/g, '')).toContain('1000000')
    expect(result).toMatch(/,00 Ft$/)
  })
})
