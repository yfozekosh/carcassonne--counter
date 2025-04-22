"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CarcassonnePointsCalculator from "@/components/carcassonne/points-calculator"
import { useGamesStore } from "@/store/games-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CurrentGamePage() {
  const { currentGameId, games } = useGamesStore()
  const router = useRouter()

  // If no current game is selected, redirect to games list
  useEffect(() => {
    if (!currentGameId && games.length > 0) {
      router.push("/games")
    }
  }, [currentGameId, games.length, router])

  if (!currentGameId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h1 className="text-2xl font-bold">No Game Selected</h1>
        <p className="text-gray-500">Please select a game from the Games page or create a new one.</p>
        <Button onClick={() => router.push("/games")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Games
        </Button>
      </div>
    )
  }

  const currentGame = games.find((game) => game.id === currentGameId)

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">
        {currentGame?.name || "Carcassonne Points Calculator"}
      </h1>
      <CarcassonnePointsCalculator />
    </div>
  )
}
