export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Carcassonne Points Calculator</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-lg">
          The Carcassonne Points Calculator is a tool designed to help you keep track of scores during your Carcassonne
          board game sessions.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Track points for up to 3 players</li>
          <li>Assign different colors to players</li>
          <li>Use multiplier cards (×1, ×2, ×4) for faster scoring</li>
          <li>View detailed point history for each player</li>
          <li>Revert points if mistakes are made</li>
          <li>Save multiple games and continue them later</li>
          <li>Track game duration and statistics</li>
          <li>Responsive design for both desktop and mobile</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">How to Use</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Create a new game from the Games page</li>
          <li>Add players with their names and colors</li>
          <li>Use the top panel to add points to the current player</li>
          <li>Use multiplier cards for features that give multiple points</li>
          <li>Track the game progress in the summary panel</li>
          <li>Save your game automatically and continue later</li>
        </ol>

        <h2 className="text-2xl font-bold mt-8 mb-4">About Carcassonne</h2>
        <p>
          Carcassonne is a tile-placement game where players fill in the countryside around the medieval fortified city
          of Carcassonne. Players place land tiles and deploy their followers (meeples) as knights, monks, farmers, or
          thieves to score points. The player with the most points at the end of the game is the winner.
        </p>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="italic">
            This calculator is a fan-made tool and is not officially affiliated with the Carcassonne board game or its
            publishers.
          </p>
        </div>
      </div>
    </div>
  )
}
