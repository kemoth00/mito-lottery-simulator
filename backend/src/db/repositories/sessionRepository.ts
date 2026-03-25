import prisma from '../pool'
import type { SessionRow, SessionStats, SessionStatus, PlayerMode } from '../../types'

export async function createSession(
  playerMode: PlayerMode,
  playerNumbers: number[] | null,
): Promise<SessionRow> {
  return prisma.session.create({
    data: {
      playerMode,
      playerNumbers: playerNumbers ?? [],
    },
  }) as unknown as SessionRow
}

export async function getSession(id: string): Promise<SessionRow | null> {
  return prisma.session.findUnique({
    where: { id },
  }) as unknown as SessionRow | null
}

export async function updateSessionTick(
  id: string,
  drawNumber: number,
  stats: SessionStats,
  status: SessionStatus,
): Promise<void> {
  const endedAt = status !== 'active' ? new Date() : null
  await prisma.session.update({
    where: { id },
    data: { drawNumber, stats: stats as object, status, endedAt },
  })
}

export async function stopSession(id: string): Promise<void> {
  await prisma.session.update({
    where: { id, status: 'active' },
    data: { status: 'stopped', endedAt: new Date() },
  })
}
