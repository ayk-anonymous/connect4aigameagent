import React from "react";

type Props = {
  onStart: () => void;
  difficulty: "easy" | "normal" | "hard";
  setDifficulty: (level: "easy" | "normal" | "hard") => void;
};

const StartMenu: React.FC<Props> = ({ onStart, difficulty, setDifficulty }) => {
  return (
    <div className="menu">
      <h1>Connect 4</h1>
      <div className="difficulty">
        <p>Select Difficulty:</p>
        <div className="buttons">
          {["easy", "normal", "hard"].map((level) => (
            <button
              key={level}
              className={difficulty === level ? "selected" : ""}
              onClick={() => setDifficulty(level as any)}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <button className="start-btn" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
};

export default StartMenu;