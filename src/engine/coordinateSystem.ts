/**
 * Coordinate System - Single Source of Truth
 *
 * This module handles ALL coordinate conversions between:
 * 1. Board-local coordinates (x, y) - origin at bottom-left of each board
 * 2. Global game coordinates (file, rank, level) - chess notation
 * 3. World 3D coordinates (x, y, z) - Three.js rendering
 *
 * Coordinate Systems:
 * - Board-local: (0,0) at bottom-left (back rank), increases right and up (toward opponent)
 * - Global: file (z=0, a=1, b=2, c=3, d=4, e=5), rank (0-10), level (board ID)
 * - World 3D: X=left/right, Y=forward/back, Z=up/down
 *
 * Piece Placement Convention:
 * - Back rank (y=0 for White, y=3 for Black on main boards): Major pieces (Knights, Bishops, Rooks, Queens, Kings)
 * - Front rank (y=1 for White, y=2 for Black on main boards): Pawns
 */

import type { Position } from './types';

/**
 * Board definition with explicit world positioning
 */
export interface BoardDefinition {
  id: string;
  type: 'main' | 'attack';
  size: { width: number; height: number }; // In squares (e.g., 4x4, 2x2)

  // World 3D position (where to render the board)
  worldPosition: { x: number; y: number; z: number }; // Bottom-left corner in world space

  // Global coordinate ranges (which files/ranks this board covers)
  globalFileRange: { min: number; max: number }; // Inclusive
  globalRankRange: { min: number; max: number }; // Inclusive
}

/**
 * All board definitions with explicit positioning
 * World coordinates: Each square is 2x2 units in world space
 *
 * Board Overlap: 50% overlap between main boards (2 rows overlap)
 * - Each 4x4 board is 8 units deep (4 rows × 2 units per row)
 * - Y-offset of 4 units creates 50% overlap (2 rows × 2 units = 4 units)
 * - White center: Y=0, Neutral center: Y=4, Black center: Y=8
 */
export const BOARD_DEFINITIONS: Record<string, BoardDefinition> = {
  // WHITE MAIN BOARD - Bottom level, centered at Y=0
  WL: {
    id: 'WL',
    type: 'main',
    size: { width: 4, height: 4 },
    worldPosition: { x: -4, y: -4, z: 0 }, // Bottom-left at Y=-4, extends to Y=4 (center Y=0)
    globalFileRange: { min: 1, max: 4 }, // files a-d
    globalRankRange: { min: 2, max: 5 }, // ranks 2-5
  },

  // NEUTRAL MAIN BOARD - Middle level, centered at Y=4 (2 rows overlap with White)
  NL: {
    id: 'NL',
    type: 'main',
    size: { width: 4, height: 4 },
    worldPosition: { x: -4, y: 0, z: 4 }, // Bottom-left at Y=0, extends to Y=8 (center Y=4)
    globalFileRange: { min: 1, max: 4 }, // files a-d
    globalRankRange: { min: 4, max: 7 }, // ranks 4-7
  },

  // BLACK MAIN BOARD - Top level, centered at Y=8 (2 rows overlap with Neutral)
  BL: {
    id: 'BL',
    type: 'main',
    size: { width: 4, height: 4 },
    worldPosition: { x: -4, y: 4, z: 8 }, // Bottom-left at Y=4, extends to Y=12 (center Y=8)
    globalFileRange: { min: 1, max: 4 }, // files a-d
    globalRankRange: { min: 6, max: 9 }, // ranks 6-9
  },

  // WHITE LEFT ATTACK BOARD (Queen side) - Extends behind white board
  // Rank 0 (behind main board), Rank 1 (lines up with main board's back rank at rank 2)
  WQL: {
    id: 'WQL',
    type: 'attack',
    size: { width: 2, height: 2 },
    worldPosition: { x: -6, y: -6, z: 2 }, // Bottom-left corner, extends behind White
    globalFileRange: { min: 0, max: 1 }, // files z-a
    globalRankRange: { min: 0, max: 1 }, // ranks 0-1
  },

  // WHITE RIGHT ATTACK BOARD (King side) - Extends behind white board
  // Rank 0 (behind main board), Rank 1 (lines up with main board's back rank at rank 2)
  WKL: {
    id: 'WKL',
    type: 'attack',
    size: { width: 2, height: 2 },
    worldPosition: { x: 2, y: -6, z: 2 }, // Bottom-left corner, extends behind White
    globalFileRange: { min: 3, max: 4 }, // files d-e
    globalRankRange: { min: 0, max: 1 }, // ranks 0-1
  },

  // BLACK LEFT ATTACK BOARD (Queen side) - Extends behind black board
  // Rank 9 (lines up with main board's back rank at rank 9), Rank 10 (behind main board)
  BQL: {
    id: 'BQL',
    type: 'attack',
    size: { width: 2, height: 2 },
    worldPosition: { x: -6, y: 10, z: 10 }, // Bottom-left corner, extends behind Black
    globalFileRange: { min: 0, max: 1 }, // files z-a
    globalRankRange: { min: 9, max: 10 }, // ranks 9-10
  },

  // BLACK RIGHT ATTACK BOARD (King side) - Extends behind black board
  // Rank 9 (lines up with main board's back rank at rank 9), Rank 10 (behind main board)
  BKL: {
    id: 'BKL',
    type: 'attack',
    size: { width: 2, height: 2 },
    worldPosition: { x: 2, y: 10, z: 10 }, // Bottom-left corner, extends behind Black
    globalFileRange: { min: 3, max: 4 }, // files d-e
    globalRankRange: { min: 9, max: 10 }, // ranks 9-10
  },
};

/**
 * Square size in world units
 */
const SQUARE_SIZE = 2;

/**
 * Convert board-local coordinates to global Position
 * @param boardId - Board identifier (WL, WQL, etc.)
 * @param x - Board-local X coordinate (0-indexed from left)
 * @param y - Board-local Y coordinate (0-indexed from bottom)
 * @returns Global Position { file, rank, level }
 */
export function boardLocalToGlobal(boardId: string, x: number, y: number): Position {
  const board = BOARD_DEFINITIONS[boardId];
  if (!board) {
    throw new Error(`Unknown board ID: ${boardId}`);
  }

  // Validate coordinates are within board bounds
  if (x < 0 || x >= board.size.width || y < 0 || y >= board.size.height) {
    throw new Error(
      `Coordinates (${x}, ${y}) out of bounds for board ${boardId} (size: ${board.size.width}x${board.size.height})`
    );
  }

  return {
    file: board.globalFileRange.min + x,
    rank: board.globalRankRange.min + y,
    level: board.id,
  };
}

/**
 * Convert global Position to world 3D coordinates
 * @param position - Global position { file, rank, level }
 * @returns World coordinates [x, y, z]
 */
export function globalToWorld(position: Position): [number, number, number] {
  const board = BOARD_DEFINITIONS[position.level];
  if (!board) {
    throw new Error(`Unknown board level: ${position.level}`);
  }

  // Calculate board-local coordinates from global position
  const localX = position.file - board.globalFileRange.min;
  const localY = position.rank - board.globalRankRange.min;

  // Validate position is within board's global range
  if (
    position.file < board.globalFileRange.min ||
    position.file > board.globalFileRange.max ||
    position.rank < board.globalRankRange.min ||
    position.rank > board.globalRankRange.max
  ) {
    throw new Error(
      `Position (file:${position.file}, rank:${position.rank}) out of range for board ${position.level}`
    );
  }

  // Convert to world coordinates
  // Board-local (0,0) maps to board's worldPosition
  // Each square is SQUARE_SIZE units, centered in the square
  const worldX = board.worldPosition.x + (localX + 0.5) * SQUARE_SIZE;
  const worldY = board.worldPosition.y + (localY + 0.5) * SQUARE_SIZE;
  const worldZ = board.worldPosition.z;

  return [worldX, worldY, worldZ];
}

/**
 * Composite function: Convert board-local coordinates directly to world 3D coordinates
 * @param boardId - Board identifier
 * @param x - Board-local X coordinate
 * @param y - Board-local Y coordinate
 * @returns World coordinates [x, y, z]
 */
export function boardLocalToWorld(boardId: string, x: number, y: number): [number, number, number] {
  const globalPosition = boardLocalToGlobal(boardId, x, y);
  return globalToWorld(globalPosition);
}

/**
 * Get board definition by ID
 */
export function getBoardDefinition(boardId: string): BoardDefinition {
  const board = BOARD_DEFINITIONS[boardId];
  if (!board) {
    throw new Error(`Unknown board ID: ${boardId}`);
  }
  return board;
}

/**
 * Get all board IDs
 */
export function getAllBoardIds(): string[] {
  return Object.keys(BOARD_DEFINITIONS);
}

/**
 * Check if a position is valid on a specific board
 */
export function isValidPositionOnBoard(boardId: string, x: number, y: number): boolean {
  const board = BOARD_DEFINITIONS[boardId];
  if (!board) return false;

  return x >= 0 && x < board.size.width && y >= 0 && y < board.size.height;
}
