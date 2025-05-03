import React from "react";

type Props = {
  winner: string;
  onRestart: () => void;
  onExit: () => void;
};

const EndGameModal: React.FC<Props> = ({ winner, onRestart, onExit }) => {
  return (
    <div className="menu-overlay">
      <h2>{winner}</h2>
      <button onClick={onRestart}>Play Again</button>
      <button onClick={onExit}>Back to Menu</button>
    </div>
  );
};

export default EndGameModal;
