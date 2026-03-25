import type { SessionStatus } from '../types/sessionStatus.types'

export interface SimulationState {
  status: SessionStatus
  sessionId: string | null
  speed: number // ms per tick
  setStatus: (status: SessionStatus) => void
  setSessionId: (id: string) => void
  setSpeed: (ms: number) => void
  reset: () => void
}
