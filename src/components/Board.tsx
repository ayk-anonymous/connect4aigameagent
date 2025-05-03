import React, { useEffect, useRef, useState } from "react";
import {
  createBoard,
  dropPiece,
  getNextOpenRow,
  isValidLocation,
  minimax,
  winningMove,
  ROW_COUNT,
  COLUMN_COUNT,
  PLAYER_PIECE,
  AI_PIECE,
  Board as BoardType,
} from "../logic/GameLogic";
import TurnLabel from "./TurnLabel";

type Props = {
  difficulty: "easy" | "normal" | "hard";
  onPause: () => void;
  onGameOver: (winner: string) => void;
  goToMainMenu: () => void;
  isPaused: boolean;
};

const difficultyDepth = {
  easy: 1,
  normal: 3,
  hard: 5,
};

const Board: React.FC<Props> = ({
  difficulty,
  onPause,
  onGameOver,
  goToMainMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<BoardType>(() => createBoard());
  const [turn, setTurn] = useState<0 | 1>(() => Math.round(Math.random()) as 0 | 1);
  const [gameOver, setGameOver] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const cellSize = 80;

  const width = COLUMN_COUNT * cellSize;
  const height = (ROW_COUNT + 1) * cellSize;

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#1e2a3a";
    ctx.fillRect(0, cellSize, width, height - cellSize);

    for (let c = 0; c < COLUMN_COUNT; c++) {
      for (let r = 0; r < ROW_COUNT; r++) {
        const y = height - (ROW_COUNT - r) * cellSize;
        ctx.beginPath();
        ctx.arc(
          c * cellSize + cellSize / 2,
          y + cellSize / 2,
          cellSize / 2 - 6,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#0e1116";
        ctx.fill();
        ctx.closePath();
      }
    }

    if (hoverCol !== null && turn === 0 && isValidLocation(board, hoverCol)) {
      const row = getNextOpenRow(board, hoverCol);
      const y = height - (ROW_COUNT - row) * cellSize;
      ctx.beginPath();
      ctx.arc(
        hoverCol * cellSize + cellSize / 2,
        y + cellSize / 2,
        cellSize / 2 - 8,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(230, 57, 70, 0.5)";
      ctx.fill();
      ctx.closePath();
    }

    for (let c = 0; c < COLUMN_COUNT; c++) {
      for (let r = 0; r < ROW_COUNT; r++) {
        const y = height - (ROW_COUNT - r) * cellSize;
        const piece = board[r][c];
        const isWinningCell = winningCells.some(([wr, wc]) => wr === r && wc === c);

        if (piece === PLAYER_PIECE || piece === AI_PIECE) {
          ctx.beginPath();
          ctx.arc(
            c * cellSize + cellSize / 2,
            y + cellSize / 2,
            cellSize / 2 - 8,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = piece === PLAYER_PIECE ? "#e63946" : "#ffca3a";
          ctx.fill();
          if (isWinningCell) {
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
          }
          ctx.closePath();
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver || turn !== 0) return;
    const col = Math.floor(e.nativeEvent.offsetX / cellSize);

    if (isValidLocation(board, col)) {
      const row = getNextOpenRow(board, col);
      const newBoard = board.map((r) => [...r]);
      dropPiece(newBoard, row, col, PLAYER_PIECE);
      const win = winningMove(newBoard, PLAYER_PIECE);

      setBoard(newBoard);
      if (win && win.length > 0) {
        setWinningCells(win);
        setGameOver(true);
        setWinner("You Win!");
        return;
      }
      setTurn(1);
    }
  };

  useEffect(() => {
    drawBoard();
  }, [board, hoverCol, winningCells]);

  useEffect(() => {
    if (turn === 1 && !gameOver) {
      const depth = difficultyDepth[difficulty];
      setTimeout(() => {
        const [col] = minimax(board, depth, -Infinity, Infinity, true);
        if (col !== null && isValidLocation(board, col)) {
          const row = getNextOpenRow(board, col);
          const newBoard = board.map((r) => [...r]);
          dropPiece(newBoard, row, col, AI_PIECE);
          const win = winningMove(newBoard, AI_PIECE);

          setBoard(newBoard);
          if (win && win.length > 0) {
            setWinningCells(win);
            setGameOver(true);
            setWinner("AI Wins!");
          } else {
            setTurn(0);
          }
        }
      }, 400);
    }
  }, [turn]);

  const resetGame = () => {
    const startingTurn = Math.round(Math.random()) as 0 | 1;
    const newBoard = createBoard();

    setBoard(newBoard);
    setTurn(startingTurn);
    setGameOver(false);
    setWinningCells([]);
    setWinner(null);

    if (startingTurn === 1) {
      setTimeout(() => {
        const depth = difficultyDepth[difficulty];
        const [col] = minimax(newBoard, depth, -Infinity, Infinity, true);
        if (col !== null && isValidLocation(newBoard, col)) {
          const row = getNextOpenRow(newBoard, col);
          const updatedBoard = newBoard.map((r) => [...r]);
          dropPiece(updatedBoard, row, col, AI_PIECE);
          const win = winningMove(updatedBoard, AI_PIECE);

          setBoard(updatedBoard);
          if (win && win.length > 0) {
            setWinningCells(win);
            setGameOver(true);
            setWinner("AI Wins!");
          } else {
            setTurn(0);
          }
        }
      }, 400);
    }
  };

  return (
    <>
      {/* Pause Button */}
      <button
        onClick={onPause}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: "#1e2a3a",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        ⏸ Pause
      </button>

      {/* Winner Overlay */}
      {winner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e2a3a",
              color: "#fff",
              padding: "20px 40px",
              borderRadius: "6px",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            {winner}
          </div>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: "#ffca3a",
              color: "#000",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            🔁 Play Again
          </button>
          <button
            onClick={goToMainMenu}
            style={{
              backgroundColor: "#e63946",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🏠 Main Menu
          </button>
        </div>
      )}

      {/* Game Board */}
      <div
        className="board-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "60px",
        }}
      >
        <TurnLabel turn={turn} />
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleClick}
          onMouseMove={(e) =>
            setHoverCol(Math.floor(e.nativeEvent.offsetX / cellSize))
          }
          onMouseLeave={() => setHoverCol(null)}
        />
      </div>
    </>
  );
};

export default Board;
