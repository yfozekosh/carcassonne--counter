"use client"

import type { Multiplier } from "@/types"

interface MultiplierCardProps {
  value: Multiplier
  isSelected: boolean
  onClick: () => void
}

export default function MultiplierCard({ value, isSelected, onClick }: MultiplierCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-sm transition-all ${
        isSelected
          ? "bg-white text-black border-black shadow-md scale-105"
          : "bg-white/70 text-black/70 border-black/30"
      }`}
    >
      ×{value}
    </button>
  )
}
