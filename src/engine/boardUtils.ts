/**
 * Utility functions for board state and position management
 */

import type { Position, Board, Piece, AttackBoardPosition } from './types';
import { LEVEL_IDS } from './constants';
import { BOARD_DEFINITIONS } from './coordinateSystem';

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.file === pos2.file && pos1.rank === pos2.rank && pos1.level === pos2.level;
}

/**
 * Check if a position is within the bounds of the 10x6 grid
 */
export function isValidGridPosition(file: number, rank: number): boolean {
  return file >= 0 && file < 6 && rank >= 0 && rank < 10;
}

/**
 * Check if a position exists on any board
 */
export function positionExistsOnBoard(position: Position, boards: Board[]): boolean { // eslint-disable-line @typescript-eslint/no-unused-vars
  const boardDef = BOARD_DEFINITIONS[position.level];
  if (!boardDef) return false;

  // Check if position is within board's global file and rank ranges
  return (
    position.file >= boardDef.globalFileRange.min &&
    position.file <= boardDef.globalFileRange.max &&
    position.rank >= boardDef.globalRankRange.min &&
    position.rank <= boardDef.globalRankRange.max
  );
}

/**
 * Check if a position is on a main board (4x4)
 * Main boards occupy files a-d (1-4) and specific rank ranges
 */
export function isOnMainBoard(position: Position, level: string): boolean {
  const { file, rank } = position;

  // Main boards use files a-d (1-4)
  if (file < 1 || file > 4) return false;

  // Check rank ranges for each main board
  switch (level) {
    case LEVEL_IDS.WHITE_MAIN:
      return rank >= 2 && rank <= 5;
    case LEVEL_IDS.NEUTRAL_MAIN:
      return rank >= 4 && rank <= 7;
    case LEVEL_IDS.BLACK_MAIN:
      return rank >= 6 && rank <= 9;
    default:
      return false;
  }
}

/**
 * Check if a position is on an attack board (2x2)
 */
export function isOnAttackBoard(position: Position, board: Board): boolean {
  if (board.type !== 'attack' || !board.position) return false;

  const { fileOffset, rankOffset } = board.position;
  const { file, rank } = position;

  return (
    file >= fileOffset &&
    file < fileOffset + 2 &&
    rank >= rankOffset &&
    rank < rankOffset + 2
  );
}

/**
 * Get the board that contains a given position
 */
export function getBoardAtPosition(position: Position, boards: Board[]): Board | undefined {
  return boards.find((board) => {
    if (board.level !== position.level) return false;
    if (board.type === 'main') {
      return isOnMainBoard(position, board.level);
    } else {
      return isOnAttackBoard(position, board);
    }
  });
}

/**
 * Get piece at a specific position
 */
export function getPieceAtPosition(position: Position, pieces: Piece[]): Piece | undefined {
  return pieces.find((piece) => positionsEqual(piece.position, position));
}

/**
 * Check if a vertical column is blocked
 * A piece blocks vertical movement through its (file, rank) on all levels
 */
export function isVerticalColumnBlocked(
  file: number,
  rank: number,
  pieces: Piece[],
  excludePiece?: Piece
): boolean {
  return pieces.some(
    (piece) =>
      piece.position.file === file &&
      piece.position.rank === rank &&
      (!excludePiece || piece.id !== excludePiece.id)
  );
}

/**
 * Get all pieces blocking a specific column
 */
export function getPiecesBlockingColumn(file: number, rank: number, pieces: Piece[]): Piece[] {
  return pieces.filter(
    (piece) => piece.position.file === file && piece.position.rank === rank
  );
}

/**
 * Check if a path between two positions on the same level is clear
 * Used for sliding pieces (rook, bishop, queen)
 */
export function isPathClear(
  from: Position,
  to: Position,
  pieces: Piece[],
  boards: Board[]
): boolean {
  // Must be on same level for 2D path checking
  if (from.level !== to.level) return true;

  const fileDir = Math.sign(to.file - from.file);
  const rankDir = Math.sign(to.rank - from.rank);

  let currentFile = from.file + fileDir;
  let currentRank = from.rank + rankDir;

  while (currentFile !== to.file || currentRank !== to.rank) {
    const checkPos: Position = {
      file: currentFile,
      rank: currentRank,
      level: from.level,
    };

    // Check if position exists on board and has a piece
    if (positionExistsOnBoard(checkPos, boards) && getPieceAtPosition(checkPos, pieces)) {
      return false;
    }

    currentFile += fileDir;
    currentRank += rankDir;
  }

  return true;
}

/**
 * Convert position to algebraic notation (e.g., "a2-WL")
 */
export function positionToAlgebraic(position: Position): string {
  const files = ['z', 'a', 'b', 'c', 'd', 'e'];
  return `${files[position.file]}${position.rank}-${position.level}`;
}

/**
 * Parse algebraic notation to position
 */
export function parseAlgebraic(notation: string): Position | null {
  const match = notation.match(/^([zabcde])(\d+)-(\w+)$/);
  if (!match) return null;

  const files = ['z', 'a', 'b', 'c', 'd', 'e'];
  const file = files.indexOf(match[1]);
  const rank = parseInt(match[2], 10);
  const level = match[3];

  if (file === -1 || isNaN(rank)) return null;

  return { file, rank, level };
}

/**
 * Get all levels (boards) that exist at a given file/rank coordinate
 */
export function getLevelsAtCoordinate(
  file: number,
  rank: number,
  boards: Board[]
): string[] {
  const levels: string[] = [];

  for (const board of boards) {
    const testPos: Position = { file, rank, level: board.level };
    if (board.type === 'main' && isOnMainBoard(testPos, board.level)) {
      levels.push(board.level);
    } else if (board.type === 'attack' && isOnAttackBoard(testPos, board)) {
      levels.push(board.level);
    }
  }

  return levels;
}

/**
 * Check if an attack board can move to a new position
 */
export function canMoveAttackBoard(
  board: Board,
  newPosition: AttackBoardPosition,
  pieces: Piece[]
): boolean {
  if (board.type !== 'attack' || !board.position) return false;

  // Check how many pieces are on the board
  const piecesOnBoard = pieces.filter((piece) => piece.position.level === board.level);

  // Cannot move if more than one piece on board
  if (piecesOnBoard.length > 1) return false;

  // If occupied, can only move forward or sideways (not backward)
  if (piecesOnBoard.length === 1) {
    const occupyingPiece = piecesOnBoard[0];
    const isWhite = occupyingPiece.color === 'white';
    const isBackward = isWhite
      ? newPosition.rankOffset < board.position.rankOffset
      : newPosition.rankOffset > board.position.rankOffset;

    if (isBackward) return false;
  }

  // Check that new position is valid (within grid)
  const maxFile = 6 - 2; // 2x2 board can start at files 0-4
  const maxRank = 10 - 2; // 2x2 board can start at ranks 0-8

  return (
    newPosition.fileOffset >= 0 &&
    newPosition.fileOffset <= maxFile &&
    newPosition.rankOffset >= 0 &&
    newPosition.rankOffset <= maxRank
  );
}

/**
 * Clone a position object
 */
export function clonePosition(position: Position): Position {
  return { ...position };
}
