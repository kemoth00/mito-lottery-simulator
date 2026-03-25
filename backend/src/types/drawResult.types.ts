export interface DrawResultRow {
  id: string
  session_id: string
  draw_number: number
  player_numbers: number[]
  draw_numbers: number[]
  match_count: number
  drawn_at: Date
}
