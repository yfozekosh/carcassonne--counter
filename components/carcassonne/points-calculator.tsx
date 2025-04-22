"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import type { Player, GameState, Multiplier } from "@/types"
import AddPlayerForm from "@/components/carcassonne/add-player-form"
import CurrentPlayerPanel from "@/components/carcassonne/current-player-panel"
import PlayerCard from "@/components/carcassonne/player-card"
import GameSummary from "@/components/carcassonne/game-summary"
import { useGamesStore } from "@/store/games-store"
// Add import for MAX_PLAYERS at the top of the file
import { MAX_PLAYERS } from "@/config/environment"

export default function CarcassonnePointsCalculator() {
  const [players, setPlayers] = useState<Player[]>([])
  const [pointsToAdd, setPointsToAdd] = useState<Record<string, string>>({})
  const [globalPointsToAdd, setGlobalPointsToAdd] = useState("")
  const [selectedMultiplier, setSelectedMultiplier] = useState<Record<string, Multiplier>>({})
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [editName, setEditName] = useState<Record<string, string>>({})
  const [showAddPlayer, setShowAddPlayer] = useState(true)
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [advanceTurn, setAdvanceTurn] = useState(false) // Disabled by default
  const [isLoaded, setIsLoaded] = useState(false)

  const { currentGameId, updateGameState, updateLastActivity } = useGamesStore()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const globalInputRef = useRef<HTMLInputElement>(null)

  // Load state from game store
  useEffect(() => {
    if (!currentGameId) return

    const gameState = useGamesStore.getState().getGameState(currentGameId)
    if (gameState) {
      setPlayers(gameState.players || [])
      setCurrentPlayerId(gameState.currentPlayerId)
      setSelectedPlayerId(gameState.currentPlayerId)
      setSelectedMultiplier(gameState.selectedMultiplier || {})

      // Initialize pointsToAdd for all players
      const initialPointsToAdd: Record<string, string> = {}
      if (gameState.players) {
        gameState.players.forEach((player) => {
          initialPointsToAdd[player.id] = ""
          setEditName((prev) => ({ ...prev, [player.id]: player.name }))
        })
      }
      setPointsToAdd(initialPointsToAdd)

      // Auto-hide Add Player panel when 3 players are added
      if (gameState.players && gameState.players.length >= 3) {
        setShowAddPlayer(false)
      }
    }

    setIsLoaded(true)
  }, [currentGameId])

  // Save state to game store whenever it changes
  useEffect(() => {
    if (!isLoaded || !currentGameId) return

    const gameState: GameState = {
      players,
      currentPlayerId,
      selectedMultiplier,
    }

    updateGameState(currentGameId, gameState)
    updateLastActivity(currentGameId)
  }, [players, currentPlayerId, selectedMultiplier, isLoaded, currentGameId, updateGameState, updateLastActivity])

  // Auto-hide Add Player panel when 3 players are added
  useEffect(() => {
    if (players.length >= MAX_PLAYERS) {
      setShowAddPlayer(false)
    }
  }, [players.length])

  // Update the addPlayer function to accept any color from the environment
  const addPlayer = (name: string, color: string) => {
    if (players.length >= MAX_PLAYERS) return
    if (!name.trim()) return

    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      color,
      points: [],
      total: 0,
    }

    const newPlayers = [...players, newPlayer]
    setPlayers(newPlayers)
    setPointsToAdd({ ...pointsToAdd, [newPlayer.id]: "" })
    setEditName({ ...editName, [newPlayer.id]: newPlayer.name })
    setSelectedMultiplier({ ...selectedMultiplier, [newPlayer.id]: 1 })

    // Set as current player if it's the first player or no current player is set
    if (newPlayers.length === 1 || currentPlayerId === null) {
      setCurrentPlayerId(newPlayer.id)
      setSelectedPlayerId(newPlayer.id)
    }
  }

  // Update the removePlayer function to show Add Player panel if fewer than MAX_PLAYERS
  const removePlayer = (playerId: string) => {
    // Create a new array without the removed player
    const updatedPlayers = players.filter((player) => player.id !== playerId)
    setPlayers(updatedPlayers)

    // If we're removing the current player, select another one
    if (currentPlayerId === playerId) {
      const newCurrentId = updatedPlayers.length > 0 ? updatedPlayers[0].id : null
      setCurrentPlayerId(newCurrentId)
      setSelectedPlayerId(newCurrentId)
    }

    // If we're removing the selected player, select the current player
    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(currentPlayerId)
    }

    // Show the Add Player panel if we now have fewer than MAX_PLAYERS
    if (updatedPlayers.length < MAX_PLAYERS) {
      setShowAddPlayer(true)
    }
  }

  const resetGame = () => {
    // Keep players but reset their points
    const resetPlayers = players.map((player) => ({
      ...player,
      points: [],
      total: 0,
    }))

    setPlayers(resetPlayers)

    // Reset points inputs
    const resetPointsToAdd: Record<string, string> = {}
    resetPlayers.forEach((player) => {
      resetPointsToAdd[player.id] = ""
    })
    setPointsToAdd(resetPointsToAdd)
    setGlobalPointsToAdd("")
  }

  // Parse input in format "points" or "pointsxmultiplier"
  const parsePointsInput = (input: string): { points: number; multiplier: Multiplier } => {
    if (!input.trim()) return { points: 0, multiplier: 1 }

    // Check if input contains 'x' or '*' for multiplier
    if (input.includes("x") || input.includes("X") || input.includes("*")) {
      const parts = input.split(/[xX*]/)
      if (parts.length === 2) {
        const points = Number.parseInt(parts[0].trim())
        const multiplier = Number.parseInt(parts[1].trim()) as Multiplier

        // Validate multiplier is one of the allowed values
        if ([1, 2, 4].includes(multiplier)) {
          return { points, multiplier }
        }
      }
    }

    // Default case: just points with selected multiplier
    return {
      points: Number.parseInt(input),
      multiplier: 1,
    }
  }

  const addPointsToPlayer = (playerId: string, fromGlobal = false) => {
    const inputValue = fromGlobal ? globalPointsToAdd : pointsToAdd[playerId]
    if (!inputValue?.trim()) return

    const { points, multiplier: inputMultiplier } = parsePointsInput(inputValue)
    if (isNaN(points)) return

    // Use parsed multiplier if provided, otherwise use the selected one
    const multiplier = inputMultiplier !== 1 ? inputMultiplier : selectedMultiplier[playerId] || 1

    const totalPoints = points * multiplier

    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const newPointEntry = {
            id: Date.now().toString(),
            value: points,
            multiplier: multiplier,
            total: totalPoints,
          }
          const newPoints = [...player.points, newPointEntry]
          return {
            ...player,
            points: newPoints,
            total: newPoints.reduce((sum, p) => sum + p.total, 0),
          }
        }
        return player
      }),
    )

    // Clear the input
    if (fromGlobal) {
      setGlobalPointsToAdd("")

      // Move to next player if adding from global panel and advanceTurn is true
      if (advanceTurn && players.length > 1) {
        const currentIndex = players.findIndex((p) => p.id === currentPlayerId)
        const nextIndex = (currentIndex + 1) % players.length
        const nextPlayerId = players[nextIndex].id
        setCurrentPlayerId(nextPlayerId)
        setSelectedPlayerId(nextPlayerId)

        // Focus the global input after changing player
        setTimeout(() => {
          globalInputRef.current?.focus()
        }, 0)
      }
    } else {
      setPointsToAdd({ ...pointsToAdd, [playerId]: "" })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, playerId: string, fromGlobal = false) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPointsToPlayer(playerId, fromGlobal)
    }
  }

  const addPointsToSelectedPlayer = () => {
    if (selectedPlayerId) {
      addPointsToPlayer(selectedPlayerId, true)
    }
  }

  const revertLastPoints = (playerId: string) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId && player.points.length > 0) {
          const newPoints = player.points.slice(0, -1)
          return {
            ...player,
            points: newPoints,
            total: newPoints.reduce((sum, p) => sum + p.total, 0),
          }
        }
        return player
      }),
    )
  }

  const revertToPoint = (playerId: string, pointId: string) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          const pointIndex = player.points.findIndex((p) => p.id === pointId)
          if (pointIndex !== -1) {
            const newPoints = player.points.slice(0, pointIndex)
            return {
              ...player,
              points: newPoints,
              total: newPoints.reduce((sum, p) => sum + p.total, 0),
            }
          }
        }
        return player
      }),
    )
  }

  const startEditing = (playerId: string) => {
    setEditingPlayer(playerId)
    setEditName({ ...editName, [playerId]: players.find((p) => p.id === playerId)?.name || "" })
  }

  const savePlayerName = (playerId: string) => {
    if (!editName[playerId]?.trim()) return

    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            name: editName[playerId],
          }
        }
        return player
      }),
    )
    setEditingPlayer(null)
  }

  const cancelEditing = () => {
    setEditingPlayer(null)
  }

  const setMultiplier = (playerId: string, multiplier: Multiplier) => {
    setSelectedMultiplier({ ...selectedMultiplier, [playerId]: multiplier })
  }

  const setAsCurrentPlayer = (playerId: string) => {
    setCurrentPlayerId(playerId)
    setSelectedPlayerId(playerId)
  }

  const handleSelectedPlayerChange = (playerId: string) => {
    setSelectedPlayerId(playerId)
    if (!advanceTurn) {
      setCurrentPlayerId(playerId)
    }
  }

  // Sort players by total score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total)

  // Get current player
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId)

  return (
    <div>
      {players.length > 0 && (
        <CurrentPlayerPanel
          currentPlayer={currentPlayer}
          selectedPlayer={selectedPlayer}
          players={players}
          advanceTurn={advanceTurn}
          setAdvanceTurn={setAdvanceTurn}
          globalPointsToAdd={globalPointsToAdd}
          setGlobalPointsToAdd={setGlobalPointsToAdd}
          handleSelectedPlayerChange={handleSelectedPlayerChange}
          addPointsToSelectedPlayer={addPointsToSelectedPlayer}
          handleKeyDown={handleKeyDown}
          globalInputRef={globalInputRef}
          isMobile={isMobile}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Conditionally render game summary first on mobile */}
        {isMobile && players.length > 0 && (
          <div className="lg:col-span-1 order-first lg:order-last">
            <GameSummary players={sortedPlayers} currentPlayerId={currentPlayerId} resetGame={resetGame} />
          </div>
        )}

        <div className="lg:col-span-2">
          <AddPlayerForm
            showAddPlayer={showAddPlayer}
            setShowAddPlayer={setShowAddPlayer}
            players={players}
            addPlayer={addPlayer}
          />

          {players.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Players</h2>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  currentPlayerId={currentPlayerId}
                  editingPlayer={editingPlayer}
                  editName={editName}
                  setEditName={setEditName}
                  selectedMultiplier={selectedMultiplier}
                  pointsToAdd={pointsToAdd}
                  setPointsToAdd={setPointsToAdd}
                  startEditing={startEditing}
                  savePlayerName={savePlayerName}
                  cancelEditing={cancelEditing}
                  setMultiplier={setMultiplier}
                  addPointsToPlayer={addPointsToPlayer}
                  revertLastPoints={revertLastPoints}
                  revertToPoint={revertToPoint}
                  handleKeyDown={handleKeyDown}
                  setAsCurrentPlayer={setAsCurrentPlayer}
                  removePlayer={removePlayer}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>

        {/* Render game summary on desktop */}
        {!isMobile && players.length > 0 && (
          <div className="lg:col-span-1 order-last">
            <GameSummary players={sortedPlayers} currentPlayerId={currentPlayerId} resetGame={resetGame} />
          </div>
        )}
      </div>
    </div>
  )
}
