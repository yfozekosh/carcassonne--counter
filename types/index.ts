export type Multiplier = 1 | 2 | 4

export type PointEntry = {
  id: string
  value: number
  multiplier: Multiplier
  total: number
}

export type Player = {
  id: string
  name: string
  color: "black" | "yellow" | "blue"
  points: PointEntry[]
  total: number
}

export type GameState = {
  players: Player[]
  currentPlayerId: string | null
  selectedMultiplier: Record<string, Multiplier>
}
