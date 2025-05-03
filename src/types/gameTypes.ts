export type Player = 0 | 1;
export type Piece = 0 | 1 | 2;
export type Board = number[][];
export type Position = { row: number; col: number };

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Piece | null;
  isPaused: boolean;
  showStartScreen: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export const DIFFICULTY_DEPTH = {
  easy: 1,
  normal: 2,
  hard: 5,
} as const;