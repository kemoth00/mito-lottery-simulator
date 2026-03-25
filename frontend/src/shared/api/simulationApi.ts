import type {
  CreateSessionResponse,
  PlayerMode,
  TickResponse,
} from '../types'

const BASE = '/api'

export async function createSession(
  playerMode: PlayerMode,
  playerNumbers: number[],
): Promise<CreateSessionResponse> {
  const body =
    playerMode === 'fixed'
      ? { playerMode, playerNumbers }
      : { playerMode }
  const res = await fetch(`${BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`createSession failed: ${res.status}`)
  return res.json() as Promise<CreateSessionResponse>
}

export async function tickSession(sessionId: string): Promise<TickResponse> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/tick`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error(`tick failed: ${res.status}`)
  return res.json() as Promise<TickResponse>
}

export async function stopSession(sessionId: string): Promise<void> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/stop`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error(`stop failed: ${res.status}`)
}


