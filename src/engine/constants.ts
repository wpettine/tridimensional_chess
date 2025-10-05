/**
 * Game constants and configuration
 */

import type { Board, PieceType, Color } from './types';

// File names for coordinate system
export const FILE_NAMES = ['z', 'a', 'b', 'c', 'd', 'e'] as const;

// Level identifiers
export const LEVEL_IDS = {
  WHITE_MAIN: 'WL',
  NEUTRAL_MAIN: 'NL',
  BLACK_MAIN: 'BL',
  WHITE_QUEEN_ATTACK: 'WQL',
  WHITE_KING_ATTACK: 'WKL',
  BLACK_QUEEN_ATTACK: 'BQL',
  BLACK_KING_ATTACK: 'BKL',
} as const;

// Initial board configurations
export const INITIAL_BOARDS: Board[] = [
  // Main boards (4x4)
  {
    id: LEVEL_IDS.WHITE_MAIN,
    type: 'main',
    level: LEVEL_IDS.WHITE_MAIN,
    files: 4,
    ranks: 4,
  },
  {
    id: LEVEL_IDS.NEUTRAL_MAIN,
    type: 'main',
    level: LEVEL_IDS.NEUTRAL_MAIN,
    files: 4,
    ranks: 4,
  },
  {
    id: LEVEL_IDS.BLACK_MAIN,
    type: 'main',
    level: LEVEL_IDS.BLACK_MAIN,
    files: 4,
    ranks: 4,
  },
  // Attack boards (2x2) - AT FRONT CORNERS of main boards
  // White's main board is ranks 2-5, so attack boards go at ranks 5-6 (front edge at rank 5)
  {
    id: LEVEL_IDS.WHITE_QUEEN_ATTACK,
    type: 'attack',
    level: LEVEL_IDS.WHITE_QUEEN_ATTACK,
    files: 2,
    ranks: 2,
    position: {
      fileOffset: 0, // Files z-a (left side)
      rankOffset: 5, // Ranks 5-6 (at front of main board)
      level: 'white',
    },
  },
  {
    id: LEVEL_IDS.WHITE_KING_ATTACK,
    type: 'attack',
    level: LEVEL_IDS.WHITE_KING_ATTACK,
    files: 2,
    ranks: 2,
    position: {
      fileOffset: 3, // Files d-e (right side)
      rankOffset: 5, // Ranks 5-6 (at front of main board)
      level: 'white',
    },
  },
  // Black's main board is ranks 6-9, so attack boards go at ranks 9-10 (front edge at rank 9)
  {
    id: LEVEL_IDS.BLACK_QUEEN_ATTACK,
    type: 'attack',
    level: LEVEL_IDS.BLACK_QUEEN_ATTACK,
    files: 2,
    ranks: 2,
    position: {
      fileOffset: 0, // Files z-a (left side)
      rankOffset: 9, // Ranks 9-10 (at front of main board)
      level: 'black',
    },
  },
  {
    id: LEVEL_IDS.BLACK_KING_ATTACK,
    type: 'attack',
    level: LEVEL_IDS.BLACK_KING_ATTACK,
    files: 2,
    ranks: 2,
    position: {
      fileOffset: 3, // Files d-e (right side)
      rankOffset: 9, // Ranks 9-10 (at front of main board)
      level: 'black',
    },
  },
];

// Main board file/rank ranges (a-d, 2-5 for white, 4-7 for black, etc.)
export const MAIN_BOARD_RANGES = {
  WHITE: { files: [1, 2, 3, 4], ranks: [2, 3, 4, 5] }, // a-d, ranks 2-5
  NEUTRAL: { files: [1, 2, 3, 4], ranks: [4, 5, 6, 7] }, // a-d, ranks 4-7
  BLACK: { files: [1, 2, 3, 4], ranks: [6, 7, 8, 9] }, // a-d, ranks 6-9
};

// Direction vectors for piece movement
export const ORTHOGONAL_DIRS = [
  { file: 1, rank: 0 },
  { file: -1, rank: 0 },
  { file: 0, rank: 1 },
  { file: 0, rank: -1 },
];

export const DIAGONAL_DIRS = [
  { file: 1, rank: 1 },
  { file: 1, rank: -1 },
  { file: -1, rank: 1 },
  { file: -1, rank: -1 },
];

export const KNIGHT_MOVES = [
  { file: 2, rank: 1 },
  { file: 2, rank: -1 },
  { file: -2, rank: 1 },
  { file: -2, rank: -1 },
  { file: 1, rank: 2 },
  { file: 1, rank: -2 },
  { file: -1, rank: 2 },
  { file: -1, rank: -2 },
];

export const KING_MOVES = [
  ...ORTHOGONAL_DIRS,
  ...DIAGONAL_DIRS,
];

// Board ID constants for unambiguous reference
export const BOARD_IDS = {
  WHITE_MAIN: 'WL',
  WHITE_ATTACK_L: 'WQL',
  WHITE_ATTACK_R: 'WKL',
  BLACK_MAIN: 'BL',
  BLACK_ATTACK_L: 'BQL',
  BLACK_ATTACK_R: 'BKL',
} as const;

/**
 * Master data structure for initial piece positions
 * Format: [piece_type, color, board_id, x_coordinate, y_coordinate]
 *
 * Coordinate system: Each board has its own 2D grid with origin (0,0) at bottom-left
 * - 4x4 boards: coordinates (0,0) to (3,3)
 * - 2x2 boards: coordinates (0,0) to (1,1)
 */
export interface InitialPiecePosition {
  piece: PieceType;
  color: Color;
  board: string;
  x: number; // Board-local X coordinate (0-indexed)
  y: number; // Board-local Y coordinate (0-indexed)
}

export const INITIAL_PIECE_POSITIONS: InitialPiecePosition[] = [
  // WHITE MAIN BOARD (4x4) - WL
  // Rank 1 (Back Rank, y=0): Knight, Bishop, Bishop, Knight
  { piece: 'knight', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 0, y: 0 },
  { piece: 'bishop', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 1, y: 0 },
  { piece: 'bishop', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 2, y: 0 },
  { piece: 'knight', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 3, y: 0 },
  // Rank 2 (Front Rank, y=1): 4 Pawns
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 0, y: 1 },
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 1, y: 1 },
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 2, y: 1 },
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_MAIN, x: 3, y: 1 },
  // Ranks 3-4 (y=2-3): Empty

  // WHITE LEFT ATTACK BOARD (2x2) - WQL (Queen side)
  // Rank 0 (Back Rank, y=0): Rook, Queen
  { piece: 'rook', color: 'white', board: BOARD_IDS.WHITE_ATTACK_L, x: 0, y: 0 },
  { piece: 'queen', color: 'white', board: BOARD_IDS.WHITE_ATTACK_L, x: 1, y: 0 },
  // Rank 1 (Front Rank, y=1): 2 Pawns
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_ATTACK_L, x: 0, y: 1 },
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_ATTACK_L, x: 1, y: 1 },

  // WHITE RIGHT ATTACK BOARD (2x2) - WKL (King side)
  // Rank 0 (Back Rank, y=0): King, Rook
  { piece: 'king', color: 'white', board: BOARD_IDS.WHITE_ATTACK_R, x: 0, y: 0 },
  { piece: 'rook', color: 'white', board: BOARD_IDS.WHITE_ATTACK_R, x: 1, y: 0 },
  // Rank 1 (Front Rank, y=1): 2 Pawns
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_ATTACK_R, x: 0, y: 1 },
  { piece: 'pawn', color: 'white', board: BOARD_IDS.WHITE_ATTACK_R, x: 1, y: 1 },

  // BLACK MAIN BOARD (4x4) - BL
  // Ranks 0-1 (y=0-1): Empty
  // Rank 7 (Front Rank, y=2): 4 Pawns
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 0, y: 2 },
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 1, y: 2 },
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 2, y: 2 },
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 3, y: 2 },
  // Rank 8 (Back Rank, y=3): Knight, Bishop, Bishop, Knight
  { piece: 'knight', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 0, y: 3 },
  { piece: 'bishop', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 1, y: 3 },
  { piece: 'bishop', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 2, y: 3 },
  { piece: 'knight', color: 'black', board: BOARD_IDS.BLACK_MAIN, x: 3, y: 3 },

  // BLACK LEFT ATTACK BOARD (2x2) - BQL (Queen side)
  // Rank 8 (Front Rank, y=0): 2 Pawns
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_ATTACK_L, x: 0, y: 0 },
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_ATTACK_L, x: 1, y: 0 },
  // Rank 9 (Back Rank, y=1): Rook, Queen
  { piece: 'rook', color: 'black', board: BOARD_IDS.BLACK_ATTACK_L, x: 0, y: 1 },
  { piece: 'queen', color: 'black', board: BOARD_IDS.BLACK_ATTACK_L, x: 1, y: 1 },

  // BLACK RIGHT ATTACK BOARD (2x2) - BKL (King side)
  // Rank 8 (Front Rank, y=0): 2 Pawns
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_ATTACK_R, x: 0, y: 0 },
  { piece: 'pawn', color: 'black', board: BOARD_IDS.BLACK_ATTACK_R, x: 1, y: 0 },
  // Rank 9 (Back Rank, y=1): King, Rook
  { piece: 'king', color: 'black', board: BOARD_IDS.BLACK_ATTACK_R, x: 0, y: 1 },
  { piece: 'rook', color: 'black', board: BOARD_IDS.BLACK_ATTACK_R, x: 1, y: 1 },
];
