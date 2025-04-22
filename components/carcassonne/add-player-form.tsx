"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronUp, ChevronDown, Save } from "lucide-react"
import type { Player } from "@/types"
import { MAX_PLAYERS, COLOR_NAMES, PLAYER_COLORS } from "@/config/environment"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AddPlayerFormProps {
  showAddPlayer: boolean
  setShowAddPlayer: (show: boolean) => void
  players: Player[]
  addPlayer: (name: string, color: string) => void
}

export default function AddPlayerForm({ showAddPlayer, setShowAddPlayer, players, addPlayer }: AddPlayerFormProps) {
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerColor, setNewPlayerColor] = useState<string>("blue")

  const handleAddPlayer = () => {
    if (players.length >= MAX_PLAYERS || !newPlayerName.trim()) return
    addPlayer(newPlayerName, newPlayerColor)
    setNewPlayerName("")
  }

  // Find unused colors to suggest first
  const usedColors = new Set(players.map((p) => p.color))
  const availableColors = COLOR_NAMES.filter((color) => !usedColors.has(color))
  const suggestedColor = availableColors.length > 0 ? availableColors[0] : COLOR_NAMES[0]

  // Set a suggested color when form is shown
  useState(() => {
    if (availableColors.length > 0) {
      setNewPlayerColor(suggestedColor)
    }
  })

  return (
    <Card className={`mb-4 sm:mb-8 ${showAddPlayer ? "" : "border-b-0 rounded-b-none"}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>
            Add Player ({players.length}/{MAX_PLAYERS})
          </span>
          <div className="flex items-center space-x-2">
            <div className="text-xs sm:text-sm text-gray-500">
              <Save className="inline-block mr-1 h-3 w-3" /> Auto-saved
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowAddPlayer(!showAddPlayer)} className="h-8 w-8 p-0">
              {showAddPlayer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {showAddPlayer && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                disabled={players.length >= MAX_PLAYERS}
              />
            </div>

            <div>
              <Label>Player Color</Label>
              <ScrollArea className="h-[200px] mt-2 pr-4">
                <RadioGroup
                  value={newPlayerColor}
                  onValueChange={(value) => setNewPlayerColor(value)}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {COLOR_NAMES.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={color} />
                      <Label htmlFor={color} className="flex items-center capitalize">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: PLAYER_COLORS[color] }}
                        ></div>
                        {color.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            </div>

            <Button onClick={handleAddPlayer} disabled={players.length >= MAX_PLAYERS || !newPlayerName.trim()}>
              Add Player
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
