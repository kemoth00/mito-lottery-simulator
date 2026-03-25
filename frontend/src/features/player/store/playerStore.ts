import { create } from 'zustand'
import type { PlayerState } from '../../../shared/interfaces'
import { MAX_PLAYER_NUMBERS } from '../../../shared/constants'

export const usePlayerStore = create<PlayerState>((set) => ({
  mode: 'random',
  selectedNumbers: [],

  setMode(mode) {
    set({ mode, selectedNumbers: [] })
  },

  toggleNumber(n) {
    set((state) => {
      const already = state.selectedNumbers.includes(n)
      if (already) {
        return { selectedNumbers: state.selectedNumbers.filter((x) => x !== n) }
      }
      if (state.selectedNumbers.length >= MAX_PLAYER_NUMBERS) return state
      return {
        selectedNumbers: [...state.selectedNumbers, n].sort((a, b) => a - b),
      }
    })
  },

  reset() {
    set({ mode: 'random', selectedNumbers: [] })
  },
}))
