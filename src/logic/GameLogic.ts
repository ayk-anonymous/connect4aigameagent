export const ROW_COUNT = 6;
export const COLUMN_COUNT = 7;
export const EMPTY = 0;
export const PLAYER_PIECE = 1;
export const AI_PIECE = 2;
export type Piece = 0 | 1 | 2;

export type Board = Piece[][];

export function createBoard(): Board {
  return Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill(EMPTY));
}

export function isValidLocation(board: Board, col: number): boolean {
  return board[0][col] === EMPTY;
}

export function getNextOpenRow(board: Board, col: number): number {
  for (let r = ROW_COUNT - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return -1;
}

export function dropPiece(board: Board, row: number, col: number, piece: Piece): void {
  board[row][col] = piece;
}

export function winningMove(board: Board, piece: Piece): [number, number][] {
  // Horizontal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (
        board[r][c] === piece &&
        board[r][c + 1] === piece &&
        board[r][c + 2] === piece &&
        board[r][c + 3] === piece
      ) {
        return [
          [r, c],
          [r, c + 1],
          [r, c + 2],
          [r, c + 3],
        ];
      }
    }
  }

  // Vertical
  for (let c = 0; c < COLUMN_COUNT; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c] === piece &&
        board[r + 2][c] === piece &&
        board[r + 3][c] === piece
      ) {
        return [
          [r, c],
          [r + 1, c],
          [r + 2, c],
          [r + 3, c],
        ];
      }
    }
  }

  // Positive diagonal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] === piece &&
        board[r + 1][c + 1] === piece &&
        board[r + 2][c + 2] === piece &&
        board[r + 3][c + 3] === piece
      ) {
        return [
          [r, c],
          [r + 1, c + 1],
          [r + 2, c + 2],
          [r + 3, c + 3],
        ];
      }
    }
  }

  // Negative diagonal
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 3; r < ROW_COUNT; r++) {
      if (
        board[r][c] === piece &&
        board[r - 1][c + 1] === piece &&
        board[r - 2][c + 2] === piece &&
        board[r - 3][c + 3] === piece
      ) {
        return [
          [r, c],
          [r - 1, c + 1],
          [r - 2, c + 2],
          [r - 3, c + 3],
        ];
      }
    }
  }

  return [];
}

export function getValidLocations(board: Board): number[] {
  return Array.from({ length: COLUMN_COUNT }, (_, i) => i).filter((col) =>
    isValidLocation(board, col)
  );
}

function evaluateWindow(window: Piece[], piece: Piece): number {
  let score = 0;
  const oppPiece = piece === PLAYER_PIECE ? AI_PIECE : PLAYER_PIECE;

  const count = (val: Piece) => window.filter((p) => p === val).length;

  if (count(piece) === 4) score += 100;
  else if (count(piece) === 3 && count(EMPTY) === 1) score += 5;
  else if (count(piece) === 2 && count(EMPTY) === 2) score += 2;

  if (count(oppPiece) === 3 && count(EMPTY) === 1) score -= 4;

  return score;
}

export function scorePosition(board: Board, piece: Piece): number {
  let score = 0;

  // Center column
  const center = Math.floor(COLUMN_COUNT / 2);
  const centerArray = board.map((row) => row[center]);
  score += centerArray.filter((p) => p === piece).length * 3;

  // Horizontal
  for (let r = 0; r < ROW_COUNT; r++) {
    const row = board[r];
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      const window = row.slice(c, c + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Vertical
  for (let c = 0; c < COLUMN_COUNT; c++) {
    const col = board.map((row) => row[c]);
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      const window = col.slice(r, r + 4);
      score += evaluateWindow(window, piece);
    }
  }

  // Positive diagonal
  for (let r = 0; r < ROW_COUNT - 3; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      const window = [0, 1, 2, 3].map((i) => board[r + i][c + i]);
      score += evaluateWindow(window, piece);
    }
  }

  // Negative diagonal
  for (let r = 3; r < ROW_COUNT; r++) {
    for (let c = 0; c < COLUMN_COUNT - 3; c++) {
      const window = [0, 1, 2, 3].map((i) => board[r - i][c + i]);
      score += evaluateWindow(window, piece);
    }
  }

  return score;
}

function isTerminalNode(board: Board): boolean {
  return (
    winningMove(board, PLAYER_PIECE).length > 0 ||
    winningMove(board, AI_PIECE).length > 0 ||
    getValidLocations(board).length === 0
  );
}

export function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): [number | null, number] {
  const validLocations = getValidLocations(board);
  const terminal = isTerminalNode(board);

  if (depth === 0 || terminal) {
    if (terminal) {
      if (winningMove(board, AI_PIECE).length > 0) return [null, 1e14];
      else if (winningMove(board, PLAYER_PIECE).length > 0) return [null, -1e14];
      else return [null, 0];
    }
    return [null, scorePosition(board, AI_PIECE)];
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      const bCopy = board.map((r) => [...r]);
      dropPiece(bCopy, row, col, AI_PIECE);
      const newScore = minimax(bCopy, depth - 1, alpha, beta, false)[1];
      if (newScore > value) {
        value = newScore;
        column = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return [column, value];
  } else {
    let value = Infinity;
    let column = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const row = getNextOpenRow(board, col);
      const bCopy = board.map((r) => [...r]);
      dropPiece(bCopy, row, col, PLAYER_PIECE);
      const newScore = minimax(bCopy, depth - 1, alpha, beta, true)[1];
      if (newScore < value) {
        value = newScore;
        column = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return [column, value];
  }
}
