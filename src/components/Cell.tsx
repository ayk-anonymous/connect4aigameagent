import React from 'react';
import { useDropAnimation } from '../hooks/useAnimation';
import '../styles/main.css';

interface CellProps {
  row: number;
  col: number;
  value: number;
}

const Cell: React.FC<CellProps> = ({ row, col, value }) => {
  const { animating, currentRow } = useDropAnimation(col, row, value);

  const getPieceColor = () => {
    if (value === 1) return 'red';
    if (value === 2) return 'yellow';
    return 'empty';
  };

  const isAnimatedPiece = animating && currentRow === row;

  return (
    <div className={`cell ${getPieceColor()}`}>
      {(value !== 0 || isAnimatedPiece) && (
        <div 
          className={`piece ${getPieceColor()} ${isAnimatedPiece ? 'animate' : ''}`}
          style={{ 
            backgroundColor: value === 1 ? '#ff0000' : value === 2 ? '#ffff00' : 'transparent',
            transform: animating && currentRow < row ? `translateY(${(row - currentRow) * 100}%)` : 'none'
          }}
        />
      )}
    </div>
  );
};

export default Cell;