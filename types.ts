export interface Track {
  id: string;
  title: string;
  artist: string;
  url?: string; // For standard audio
  blob?: Blob;  // For AI generated audio
  duration?: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  PAUSED = 'PAUSED'
}

export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}