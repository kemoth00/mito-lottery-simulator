export interface DrawState {
  currentDraw: number[]
  currentPlayerNumbers: number[]
  matchCount: number
  setDraw: (draw: number[], playerNumbers: number[], matchCount: number) => void
  reset: () => void
}
