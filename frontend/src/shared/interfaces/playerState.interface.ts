import type { PlayerMode } from '../types/playerMode.types'

export interface PlayerState {
  mode: PlayerMode
  selectedNumbers: number[]
  setMode: (mode: PlayerMode) => void
  toggleNumber: (n: number) => void
  reset: () => void
}
