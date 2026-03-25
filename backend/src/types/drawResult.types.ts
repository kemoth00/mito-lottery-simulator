/** Matches the Prisma model shape (camelCase field names) */
export interface DrawResultRow {
  id: string
  sessionId: string
  drawNumber: number
  playerNumbers: number[]
  drawNumbers: number[]
  matchCount: number
  drawnAt: Date
}
