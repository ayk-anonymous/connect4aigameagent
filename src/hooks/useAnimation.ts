import { useState, useEffect } from 'react';

export const useDropAnimation = (col: number, row: number, piece: number) => {
  const [animating, setAnimating] = useState(false);
  const [currentRow, setCurrentRow] = useState(-1);

  useEffect(() => {
    if (row >= 0) {
      setAnimating(true);
      setCurrentRow(-1); // Start from top

      const animate = () => {
        setCurrentRow(prev => {
          const nextRow = prev + 1;
          if (nextRow >= row) {
            setTimeout(() => setAnimating(false), 100);
            return row;
          }
          return nextRow;
        });
      };

      const interval = setInterval(animate, 80);
      return () => clearInterval(interval);
    }
  }, [row, col]);

  return { animating, currentRow };
};