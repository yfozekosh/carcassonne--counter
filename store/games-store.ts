import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameState } from "@/types"

interface Game {
  id: string
  name: string
  createdAt: string
  lastActivityAt: string | null
  state: GameState | null
}

interface GamesStore {
  games: Game[]
  currentGameId: string | null
  addGame: (name: string) => string
  deleteGame: (id: string) => void
  setCurrentGame: (id: string | null) => void
  updateGameState: (id: string, state: GameState) => void
  updateLastActivity: (id: string) => void
  getGameState: (id: string) => GameState | null
}

export const useGamesStore = create<GamesStore>()(
  persist(
    (set, get) => ({
      games: [],
      currentGameId: null,

      addGame: (name: string) => {
        const id = Date.now().toString()
        const newGame: Game = {
          id,
          name,
          createdAt: new Date().toISOString(),
          lastActivityAt: null,
          state: {
            players: [],
            currentPlayerId: null,
            selectedMultiplier: {},
          },
        }

        set((state) => ({
          games: [...state.games, newGame],
          currentGameId: id,
        }))

        return id
      },

      deleteGame: (id: string) => {
        set((state) => {
          const newGames = state.games.filter((game) => game.id !== id)

          // If we're deleting the current game, set currentGameId to null or the first game
          let newCurrentGameId = state.currentGameId
          if (state.currentGameId === id) {
            newCurrentGameId = newGames.length > 0 ? newGames[0].id : null
          }

          return {
            games: newGames,
            currentGameId: newCurrentGameId,
          }
        })
      },

      setCurrentGame: (id: string | null) => {
        set({ currentGameId: id })
      },

      updateGameState: (id: string, state: GameState) => {
        set((store) => ({
          games: store.games.map((game) => (game.id === id ? { ...game, state } : game)),
        }))
      },

      updateLastActivity: (id: string) => {
        set((store) => ({
          games: store.games.map((game) =>
            game.id === id ? { ...game, lastActivityAt: new Date().toISOString() } : game,
          ),
        }))
      },

      getGameState: (id: string) => {
        const game = get().games.find((game) => game.id === id)
        return game?.state || null
      },
    }),
    {
      name: "carcassonne-games-storage",
    },
  ),
)
