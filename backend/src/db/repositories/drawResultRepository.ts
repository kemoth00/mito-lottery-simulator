import prisma from '../pool'
import type { DrawResultRow } from '../../types'

export async function insertDrawResult(
  sessionId: string,
  drawNumber: number,
  playerNumbers: number[],
  drawNumbers: number[],
  matchCount: number,
): Promise<void> {
  await prisma.drawResult.create({
    data: { sessionId, drawNumber, playerNumbers, drawNumbers, matchCount },
  })
}

export async function getDrawResultsBySession(sessionId: string): Promise<DrawResultRow[]> {
  return prisma.drawResult.findMany({
    where: { sessionId },
    orderBy: { drawNumber: 'asc' },
  }) as unknown as DrawResultRow[]
}
