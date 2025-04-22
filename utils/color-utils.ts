import { PLAYER_COLORS } from "@/config/environment"

export function getColorClass(color: string): string {
  const hexColor = PLAYER_COLORS[color] || "#333333"

  // Determine if text should be white or black based on color brightness
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  const textColor = brightness > 125 ? "text-black" : "text-white"

  return `bg-[${hexColor}] ${textColor}`
}

export function getColorBgClass(color: string): string {
  const hexColor = PLAYER_COLORS[color] || "#333333"
  return `bg-[${hexColor}]`
}

export function getColorBorderClass(color: string): string {
  const hexColor = PLAYER_COLORS[color] || "#333333"
  return `border-[${hexColor}]`
}

export function getColorTextClass(color: string): string {
  const hexColor = PLAYER_COLORS[color] || "#333333"
  return `text-[${hexColor}]`
}
