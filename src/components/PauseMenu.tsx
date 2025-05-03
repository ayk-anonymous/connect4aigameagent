import React from "react";

type Props = {
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
};

const PauseMenu: React.FC<Props> = ({ onResume, onRestart, onExit }) => {
  return (
    <div className="menu-overlay">
      <h2>Game Paused</h2>
      <button onClick={onResume}>Resume</button>
      <button onClick={onRestart}>Restart</button>
      <button onClick={onExit}>Back to Menu</button>
    </div>
  );
};

export default PauseMenu;
