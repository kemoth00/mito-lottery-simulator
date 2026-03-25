import { create } from 'zustand'
import type { DrawState } from '../../../shared/interfaces'

export const useDrawStore = create<DrawState>((set) => ({
  currentDraw: [],
  currentPlayerNumbers: [],
  matchCount: 0,

  setDraw(draw, playerNumbers, matchCount) {
    set({ currentDraw: draw, currentPlayerNumbers: playerNumbers, matchCount })
  },

  reset() {
    set({ currentDraw: [], currentPlayerNumbers: [], matchCount: 0 })
  },
}))
