import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, Direction, Coordinate } from '../types';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Coordinate[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
const INITIAL_DIRECTION = Direction.UP;
const SPEED_MS = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Refs for mutable state in the interval closure
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Coordinate[]) => {
    let newFood: Coordinate;
    let isCollision;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      isCollision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isCollision);
    return newFood;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleGameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    if (score > highScore) {
      setHighScore(score);
    }
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const moveSnake = useCallback(() => {
    if (status !== GameStatus.PLAYING) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check Walls
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check Self Collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, status, generateFood]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== GameStatus.PLAYING) return;

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP;
          break;
        case 'ArrowDown':
          if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN;
          break;
        case 'ArrowLeft':
          if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT;
          break;
        case 'ArrowRight':
          if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  // Game Loop
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED_MS);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  return (
    <div className="flex flex-col items-center">
        {/* Stats Bar */}
        <div className="w-full flex justify-between items-center mb-4 px-2 font-mono text-cyan-400">
            <div className="flex items-center gap-2">
                <span className="text-fuchsia-500">SCORE:</span>
                <span className="text-xl font-bold neon-text-glow">{score}</span>
            </div>
            <div className="flex items-center gap-2 opacity-70">
                <Trophy size={16} />
                <span>BEST: {highScore}</span>
            </div>
        </div>

        {/* Game Board */}
        <div 
            className="relative bg-slate-950 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden"
            style={{ 
                width: 320, // 20 * 16px
                height: 320, 
                display: 'grid', 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
            }}
        >
            {/* Grid Overlay for Retro Effect */}
            <div className="absolute inset-0 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)',
                     backgroundSize: '16px 16px'
                 }} 
            />

            {/* Render Snake & Food */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                
                const isFood = food.x === x && food.y === y;
                const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
                const isHead = snakeIndex === 0;
                const isBody = snakeIndex > 0;

                return (
                    <div key={i} className="w-full h-full flex items-center justify-center relative z-10">
                        {isFood && (
                            <div className="w-3 h-3 bg-fuchsia-500 rounded-full shadow-[0_0_10px_#d946ef] animate-pulse" />
                        )}
                        {isHead && (
                            <div className="w-3.5 h-3.5 bg-green-400 rounded-sm shadow-[0_0_10px_#4ade80]" />
                        )}
                        {isBody && (
                            <div className="w-3 h-3 bg-green-500/80 rounded-sm" />
                        )}
                    </div>
                );
            })}
            
            {/* Overlays */}
            {status === GameStatus.IDLE && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <button 
                        onClick={startGame}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-6 rounded shadow-[0_0_15px_#22c55e] transition-transform hover:scale-105"
                    >
                        <Play size={20} /> START GAME
                    </button>
                    <p className="text-green-400/60 mt-4 text-xs font-mono">USE ARROW KEYS</p>
                </div>
            )}
            
            {status === GameStatus.GAME_OVER && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
                    <h2 className="text-3xl font-bold text-red-500 neon-text-glow mb-2">GAME OVER</h2>
                    <p className="text-white font-mono mb-6">FINAL SCORE: {score}</p>
                    <button 
                        onClick={startGame}
                        className="flex items-center gap-2 border border-green-500 text-green-400 hover:bg-green-500/20 py-2 px-6 rounded transition-colors"
                    >
                        <RotateCcw size={18} /> TRY AGAIN
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default SnakeGame;