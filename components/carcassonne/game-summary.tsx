"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, RefreshCw } from "lucide-react"
import type { Player } from "@/types"
// Add import for PLAYER_COLORS at the top of the file
import { PLAYER_COLORS } from "@/config/environment"

interface GameSummaryProps {
  players: Player[]
  currentPlayerId: string | null
  resetGame: () => void
}

export default function GameSummary({ players, currentPlayerId, resetGame }: GameSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Game Summary</span>
          <Button variant="outline" size="sm" onClick={resetGame} className="text-xs">
            <RefreshCw className="mr-1 h-3 w-3" />
            New Game
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Leaderboard</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2 rounded ${
                  currentPlayerId === player.id ? "bg-yellow-100 border border-yellow-300" : "bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: PLAYER_COLORS[player.color] }}
                  ></div>
                  <span className="font-medium">
                    {index + 1}. {player.name}
                    {currentPlayerId === player.id && <Crown className="inline-block ml-1 h-3 w-3 text-yellow-600" />}
                  </span>
                </div>
                <span className="font-bold">{player.total}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Points Breakdown</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {players.map((player) => (
                <div key={player.id} className="space-y-1">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: PLAYER_COLORS[player.color] }}
                    ></div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="pl-5 text-sm">
                    {player.points.length === 0 ? (
                      <span className="text-gray-500">No points yet</span>
                    ) : (
                      <div className="space-y-1">
                        {player.points.map((point, i) => (
                          <div key={i} className="flex justify-between">
                            <span>
                              {point.value} {point.multiplier > 1 && `× ${point.multiplier}`}
                            </span>
                            <span className="font-medium">{point.total}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 border-t border-gray-200">
                          <span>Total</span>
                          <span>{player.total}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
