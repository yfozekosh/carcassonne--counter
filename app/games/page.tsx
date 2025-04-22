"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useGamesStore } from "@/store/games-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Clock, Calendar, Play, Plus, Trash2 } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

export default function GamesPage() {
  const [newGameName, setNewGameName] = useState("")
  const { games, addGame, setCurrentGame, deleteGame } = useGamesStore()
  const router = useRouter()

  const handleCreateGame = () => {
    if (!newGameName.trim()) return

    const gameId = addGame(newGameName)
    setCurrentGame(gameId)
    setNewGameName("")
    router.push("/current-game")
  }

  const handleContinueGame = (gameId: string) => {
    setCurrentGame(gameId)
    router.push("/current-game")
  }

  const handleDeleteGame = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation()
    deleteGame(gameId)
  }

  // Helper function to get the winner of a game
  const getWinner = (gameId: string) => {
    const game = games.find((g) => g.id === gameId)
    if (!game || !game.state?.players || game.state.players.length === 0) return null

    const sortedPlayers = [...game.state.players].sort((a, b) => b.total - a.total)
    return sortedPlayers[0]
  }

  // Helper function to get time since last activity
  const getTimeSinceLastActivity = (gameId: string) => {
    const game = games.find((g) => g.id === gameId)
    if (!game) return "No activity"

    const lastActivityDate = game.lastActivityAt || game.createdAt
    return formatDistanceToNow(new Date(lastActivityDate), { addSuffix: true })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Games</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
          <CardDescription>Start a new Carcassonne game session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter game name"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGame()}
            />
            <Button onClick={handleCreateGame} disabled={!newGameName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Game
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Your Games</h2>

      {games.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't created any games yet.</p>
          <p>Create your first game to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => {
            const winner = getWinner(game.id)

            return (
              <Card
                key={game.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleContinueGame(game.id)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{game.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => handleDeleteGame(e, game.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {format(new Date(game.createdAt), "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Last activity: {getTimeSinceLastActivity(game.id)}</span>
                    </div>

                    {winner && (
                      <div className="flex items-center text-sm">
                        <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>
                          Current leader: <span className="font-medium">{winner.name}</span> ({winner.total} points)
                        </span>
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="font-medium">{game.state?.players?.length || 0}</span> players
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Continue Game
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
