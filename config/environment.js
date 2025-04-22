/**
 * Application environment configuration
 */

// Maximum number of players allowed in a game
export const MAX_PLAYERS = 20

// Color map for player tokens
export const PLAYER_COLORS = {
  // Row 1
  blue: "#0066CC",
  red: "#FF0000",
  yellow: "#FFCC00",
  green: "#00CC00",
  black: "#333333",

  // Row 2
  beige: "#E8D4B9",
  pink: "#FF66B2",
  orange: "#FF6600",
  teal: "#008080",
  purple: "#800080",

  // Row 3
  brown: "#8B4513",
  olive: "#808000",
  gold: "#D4AF37",
  silver: "#C0C0C0",
  copper: "#B87333",

  // Row 4
  lightPink: "#FFB6C1",
  darkGreen: "#006400",
  limeGreen: "#BFFF00",
  navyBlue: "#000080",
  tan: "#D2B48C",
}

// List of color names for selection
export const COLOR_NAMES = Object.keys(PLAYER_COLORS)
