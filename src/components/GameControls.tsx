import React from 'react';
import '../styles/main.css';

interface GameControlsProps {
  onPause: () => void;
  onReset: () => void;
  onBackToStart: () => void;
  currentPlayer: number;
  gameOver: boolean;
  isPaused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onPause,
  onReset,
  onBackToStart,
  currentPlayer,
  gameOver,
  isPaused,
}) => {
  return (
    <div className="game-controls">
      <div className="player-indicator">
        Current Player: <span style={{ color: currentPlayer === 0 ? 'red' : 'yellow' }}>
          {currentPlayer === 0 ? 'You' : 'AI'}
        </span>
      </div>
      <div className="buttons">
        <button onClick={onReset}>Reset</button>
        <button onClick={onPause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={onBackToStart}>Main Menu</button>
      </div>
    </div>
  );
};

export default GameControls;