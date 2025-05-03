import React, { useState } from "react";
import StartMenu from "./components/StartMenu";
import Board from "./components/Board";
import PauseMenu from "./components/PauseMenu";
import EndGameModal from "./components/EndGameModal";
import "./styles.css";

type Screen = "start" | "game" | "paused" | "ended";

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("start");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");
  const [winner, setWinner] = useState<string | null>(null);
  const [boardKey, setBoardKey] = useState<number>(0); // force reset board
  const [isPaused, setIsPaused] = useState(false);

  const startGame = () => {
    setBoardKey(prev => prev + 1); // reset board
    setWinner(null);
    setIsPaused(false);
    setScreen("game");
  };

  const endGame = (winnerText: string) => {
    setWinner(winnerText);
    setScreen("ended");
  };

  const pauseGame = () => {
    setIsPaused(true);
    setScreen("paused");
  };
  
  const resumeGame = () => {
    setIsPaused(false);
    setScreen("game");
  };

  return (
    <div className="app-container">
      {screen === "start" && (
        <StartMenu
          onStart={() => {
            setScreen("game");
            startGame();
          }}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      )}

      {(screen === "game" || screen === "paused") && (
        <Board
          key={boardKey}
          difficulty={difficulty}
          onPause={pauseGame}
          onGameOver={endGame}
          isPaused={isPaused}
          goToMainMenu={() => setScreen("start")} // ✅ Pass this prop
        />
      )}

      {screen === "paused" && (
        <PauseMenu
          onResume={resumeGame}
          onRestart={startGame}
          onExit={() => setScreen("start")}
        />
      )}

      {screen === "ended" && winner && (
        <EndGameModal
          winner={winner}
          onRestart={startGame}
          onExit={() => setScreen("start")}
        />
      )}
    </div>
  );
};

export default App;
