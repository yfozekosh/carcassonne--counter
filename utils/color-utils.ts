export function getColorClass(color: string): string {
  switch (color) {
    case "black":
      return "bg-gray-800 text-white"
    case "yellow":
      return "bg-yellow-400 text-black"
    case "blue":
      return "bg-blue-500 text-white"
    default:
      return "bg-gray-800 text-white"
  }
}

export function getColorBgClass(color: string): string {
  switch (color) {
    case "black":
      return "bg-gray-800"
    case "yellow":
      return "bg-yellow-400"
    case "blue":
      return "bg-blue-500"
    default:
      return "bg-gray-800"
  }
}

export function getColorBorderClass(color: string): string {
  switch (color) {
    case "black":
      return "border-gray-800"
    case "yellow":
      return "border-yellow-400"
    case "blue":
      return "border-blue-500"
    default:
      return "border-gray-800"
  }
}
