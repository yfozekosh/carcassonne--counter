import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the current game page by default
  redirect("/current-game")
}
