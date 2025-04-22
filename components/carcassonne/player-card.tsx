"use client"

import type { KeyboardEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle, User, XCircle, Crown, Trash2 } from "lucide-react"
import type { Player, Multiplier } from "@/types"
import MultiplierCard from "@/components/carcassonne/multiplier-card"
import { getColorClass } from "@/utils/color-utils"
import { PLAYER_COLORS } from "@/config/environment"

interface PlayerCardProps {
  player: Player
  currentPlayerId: string | null
  editingPlayer: string | null
  editName: Record<string, string>
  setEditName: (editName: Record<string, string>) => void
  selectedMultiplier: Record<string, Multiplier>
  pointsToAdd: Record<string, string>
  setPointsToAdd: (pointsToAdd: Record<string, string>) => void
  startEditing: (playerId: string) => void
  savePlayerName: (playerId: string) => void
  cancelEditing: () => void
  setMultiplier: (playerId: string, multiplier: Multiplier) => void
  addPointsToPlayer: (playerId: string, fromGlobal?: boolean) => void
  revertLastPoints: (playerId: string) => void
  revertToPoint: (playerId: string, pointId: string) => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>, playerId: string, fromGlobal?: boolean) => void
  setAsCurrentPlayer: (playerId: string) => void
  removePlayer: (playerId: string) => void
  isMobile: boolean
}

export default function PlayerCard({
  player,
  currentPlayerId,
  editingPlayer,
  editName,
  setEditName,
  selectedMultiplier,
  pointsToAdd,
  setPointsToAdd,
  startEditing,
  savePlayerName,
  cancelEditing,
  setMultiplier,
  addPointsToPlayer,
  revertLastPoints,
  revertToPoint,
  handleKeyDown,
  setAsCurrentPlayer,
  removePlayer,
  isMobile,
}: PlayerCardProps) {
  return (
    <Card
      className={`border-2 ${currentPlayerId === player.id ? "ring-2 ring-offset-2 ring-yellow-500" : ""}`}
      style={{
        backgroundColor: PLAYER_COLORS[player.color],
        color: getColorClass(player.color).includes("text-white") ? "white" : "black",
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            {editingPlayer === player.id ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editName[player.id]}
                  onChange={(e) => setEditName({ ...editName, [player.id]: e.target.value })}
                  className="bg-white/90 text-black w-40"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => savePlayerName(player.id)}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEditing}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                {currentPlayerId === player.id && <Crown className="mr-1 h-4 w-4" />}
                <User className="mr-2" />
                <span className="text-sm sm:text-base">{player.name}</span>
                <Button size="sm" variant="ghost" onClick={() => startEditing(player.id)} className="ml-2 h-8 w-8 p-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  <span className="sr-only">Edit</span>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">Total: {player.total}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removePlayer(player.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
              title="Remove player"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                value={pointsToAdd[player.id] || ""}
                onChange={(e) => setPointsToAdd({ ...pointsToAdd, [player.id]: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, player.id)}
                placeholder="Points to add (e.g. 5 or 5x2)"
                className="bg-white/90 text-black"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={() => addPointsToPlayer(player.id)}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <PlusCircle className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="text-xs sm:text-sm">Add</span>
                </Button>
                <Button
                  onClick={() => revertLastPoints(player.id)}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  disabled={player.points.length === 0}
                  className="bg-white/90 text-black hover:bg-white"
                >
                  <MinusCircle className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="text-xs sm:text-sm">Revert</span>
                </Button>
              </div>
            </div>

            <div>
              <Label className="mb-1 block">Multiplier Cards</Label>
              <div className="flex space-x-2">
                <MultiplierCard
                  value={1}
                  isSelected={selectedMultiplier[player.id] === 1}
                  onClick={() => setMultiplier(player.id, 1)}
                />
                <MultiplierCard
                  value={2}
                  isSelected={selectedMultiplier[player.id] === 2}
                  onClick={() => setMultiplier(player.id, 2)}
                />
                <MultiplierCard
                  value={4}
                  isSelected={selectedMultiplier[player.id] === 4}
                  onClick={() => setMultiplier(player.id, 4)}
                />
              </div>
            </div>
          </div>

          {player.points.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Points History:</h3>
              <div className="flex flex-wrap gap-2">
                {player.points.map((pointEntry) => (
                  <div key={pointEntry.id} className="px-2 py-1 bg-white/20 rounded flex items-center group relative">
                    {pointEntry.value > 0 ? `+${pointEntry.value}` : pointEntry.value}
                    {pointEntry.multiplier > 1 && (
                      <span className="ml-1 px-1 bg-white/30 rounded text-xs">×{pointEntry.multiplier}</span>
                    )}
                    {pointEntry.multiplier > 1 && <span className="ml-1 text-xs">= {pointEntry.total}</span>}
                    <button
                      onClick={() => revertToPoint(player.id, pointEntry.id)}
                      className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 transition-opacity"
                      title="Revert to this point"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAsCurrentPlayer(player.id)}
          disabled={currentPlayerId === player.id}
          className="bg-white/90 text-black hover:bg-white text-xs"
        >
          <Crown className="mr-1 h-3 w-3" />
          Set as Current Player
        </Button>
      </CardFooter>
    </Card>
  )
}
