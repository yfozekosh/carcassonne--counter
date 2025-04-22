"use client"

import type { RefObject, KeyboardEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Crown } from "lucide-react"
import type { Player } from "@/types"
import { getColorBgClass, getColorClass, getColorBorderClass } from "@/utils/color-utils"
// Add import for PLAYER_COLORS at the top of the file
import { PLAYER_COLORS } from "@/config/environment"

interface CurrentPlayerPanelProps {
  currentPlayer: Player | undefined
  selectedPlayer: Player | undefined
  players: Player[]
  advanceTurn: boolean
  setAdvanceTurn: (value: boolean) => void
  globalPointsToAdd: string
  setGlobalPointsToAdd: (value: string) => void
  handleSelectedPlayerChange: (playerId: string) => void
  addPointsToSelectedPlayer: () => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>, playerId: string, fromGlobal: boolean) => void
  globalInputRef: RefObject<HTMLInputElement>
  isMobile: boolean
}

export default function CurrentPlayerPanel({
  currentPlayer,
  selectedPlayer,
  players,
  advanceTurn,
  setAdvanceTurn,
  globalPointsToAdd,
  setGlobalPointsToAdd,
  handleSelectedPlayerChange,
  addPointsToSelectedPlayer,
  handleKeyDown,
  globalInputRef,
  isMobile,
}: CurrentPlayerPanelProps) {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm sm:text-base">Current Player: {currentPlayer?.name || "None"}</span>
            {currentPlayer && (
              <div className={`ml-2 w-3 h-3 sm:w-4 sm:h-4 ${getColorBgClass(currentPlayer.color)} rounded-full`}></div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="advance-turn" className="text-xs sm:text-sm">
              Auto-advance turn
            </Label>
            <Switch id="advance-turn" checked={advanceTurn} onCheckedChange={setAdvanceTurn} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Player selection buttons instead of dropdown */}
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-0 max-w-[300px]">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelectedPlayerChange(player.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    player.id === selectedPlayer?.id
                      ? `${getColorClass(player.color)} border-white ring-2 ring-black`
                      : `bg-white ${getColorBorderClass(player.color)}`
                  }`}
                  title={player.name}
                  style={{ backgroundColor: player.id === selectedPlayer?.id ? PLAYER_COLORS[player.color] : "white" }}
                >
                  {player.id === selectedPlayer?.id && <Crown className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <Input
              ref={globalInputRef}
              type="text"
              value={globalPointsToAdd}
              onChange={(e) => setGlobalPointsToAdd(e.target.value)}
              onKeyDown={(e) => selectedPlayer && handleKeyDown(e, selectedPlayer.id, true)}
              placeholder="Points to add (e.g. 5 or 5x2)"
              className="flex-1"
              disabled={!selectedPlayer}
            />
            <Button
              onClick={addPointsToSelectedPlayer}
              disabled={!selectedPlayer || !globalPointsToAdd.trim()}
              size={isMobile ? "sm" : "default"}
            >
              <PlusCircle className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="text-xs sm:text-sm">{advanceTurn ? "Add & Next" : "Add Points"}</span>
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Tip: Type "5x2" to add 5 points with a multiplier of 2. Press Enter to add points.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
