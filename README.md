# Carcassonne Points Calculator

A web-based application to manage and calculate points for the board game **Carcassonne**. This tool allows players to easily track scores, manage turns, and view a detailed breakdown of points for each player.

## Features

- **Add Players**: Add up to 3 players with customizable names and colors.
- **Points Management**:
    - Add points with optional multipliers (e.g., `5x2` for 10 points).
    - Revert the last points added or revert to a specific point in the history.
- **Turn Management**:
    - Auto-advance turns for seamless gameplay.
    - Set the current player manually.
- **Game Summary**:
    - View a leaderboard with total scores.
    - Detailed points breakdown for each player.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Local Storage**: Automatically saves the game state, so you can resume where you left off.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Framework**: Next.js
- **Icons**: Lucide React
- **State Management**: React hooks
- **Utilities**: Tailwind Merge, clsx

## Initial Version

The initial version of this project was built using **Vercel v0**.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YuriiFozekosh/carcassonne--counter.git
   cd carcassonne--counter
   ```

2. Install dependencies:
   ```bash
   # if pnpm is not installed
   # npm install -g pnpm@latest-10
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```

4. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Building and Running with Docker

### Build Docker Image

1. Build the Docker image:
   ```bash
   docker build -t carcassonne-counter .
   ```

### Run Docker Container

2. Run the Docker container:
   ```bash
   docker run -p 8080:8080 carcassonne-counter
   ```

3. Open the app in your browser:
   ```
   http://localhost:8080
   ```

## File Structure

- `app/`: Contains the main layout and pages.
- `components/`: Reusable UI components for the app.
    - `carcassonne/`: Components specific to the Carcassonne Points Calculator.
    - `ui/`: General-purpose UI components (e.g., buttons, inputs, cards).
- `hooks/`: Custom React hooks.
- `utils/`: Utility functions for color management and class merging.
- `types/`: TypeScript types for the app.
- `styles/`: Global CSS styles.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- Inspired by the board game **Carcassonne**.
- Built with **Next.js**, **React**, and **Tailwind CSS**.
```
