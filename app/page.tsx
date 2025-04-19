"use client"
import CarcassonnePointsCalculator from "@/components/carcassonne/points-calculator"

export default function Home() {
  return (
    <div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Carcassonne Points Calculator</h1>
      <CarcassonnePointsCalculator />
    </div>
  )
}
