import { create } from 'zustand'
import type { SimulationState } from '../../../shared/interfaces'
import { DEFAULT_SIMULATION_SPEED } from '../../../shared/constants'

export const useSimulationStore = create<SimulationState>((set) => ({
  status: 'idle',
  sessionId: null,
  speed: DEFAULT_SIMULATION_SPEED,

  setStatus(status) {
    set({ status })
  },

  setSessionId(id) {
    set({ sessionId: id })
  },

  setSpeed(ms) {
    set({ speed: ms })
  },

  reset() {
    set({ status: 'idle', sessionId: null })
  },
}))
