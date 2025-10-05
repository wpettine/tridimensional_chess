/**
 * Move validation logic for 3D chess
 * Implements all piece movement rules including 3D constraints
 */

import type {
  Piece,
  Position,
  Board,
  MoveValidationResult,
  Color,
} from './types';
import {
  positionsEqual,
  getPieceAtPosition,
  isVerticalColumnBlocked,
  isPathClear,
  positionExistsOnBoard,
} from './boardUtils';
import {
  ORTHOGONAL_DIRS,
  DIAGONAL_DIRS,
  KNIGHT_MOVES,
  KING_MOVES,
} from './constants';

/**
 * Validate if a move is legal for a piece
 */
export function validateMove(
  piece: Piece,
  to: Position,
  pieces: Piece[],
  boards: Board[],
  enPassantTarget?: Position
): MoveValidationResult {
  // Cannot move to same position
  if (positionsEqual(piece.position, to)) {
    return { valid: false, reason: 'Cannot move to same position' };
  }

  // Check if destination exists on a board
  if (!positionExistsOnBoard(to, boards)) {
    return { valid: false, reason: 'Destination does not exist on any board' };
  }

  // Check if destination has piece of same color
  const targetPiece = getPieceAtPosition(to, pieces);
  if (targetPiece && targetPiece.color === piece.color) {
    return { valid: false, reason: 'Cannot capture own piece' };
  }

  // Validate piece-specific movement
  let moveValid = false;

  switch (piece.type) {
    case 'pawn':
      moveValid = isValidPawnMove(piece, to, pieces, boards, enPassantTarget);
      break;
    case 'knight':
      moveValid = isValidKnightMove(piece, to, boards);
      break;
    case 'bishop':
      moveValid = isValidBishopMove(piece, to, pieces, boards);
      break;
    case 'rook':
      moveValid = isValidRookMove(piece, to, pieces, boards);
      break;
    case 'queen':
      moveValid = isValidQueenMove(piece, to, pieces, boards);
      break;
    case 'king':
      moveValid = isValidKingMove(piece, to, boards);
      break;
  }

  if (!moveValid) {
    return { valid: false, reason: `Invalid ${piece.type} move` };
  }

  // Check vertical column blocking (except for knights)
  // Note: Vertical movement without horizontal displacement is not allowed
  // per Meder's Rules Section 2.2
  if (piece.type !== 'knight') {
    if (
      piece.position.file === to.file &&
      piece.position.rank === to.rank &&
      piece.position.level !== to.level
    ) {
      return { valid: false, reason: 'Cannot move vertically without horizontal displacement' };
    }
  }

  return {
    valid: true,
    capturedPiece: targetPiece,
  };
}

/**
 * Pawn movement validation
 */
function isValidPawnMove(
  pawn: Piece,
  to: Position,
  pieces: Piece[],
  _boards: Board[], // eslint-disable-line @typescript-eslint/no-unused-vars
  enPassantTarget?: Position
): boolean {
  const direction = pawn.color === 'white' ? 1 : -1;
  const from = pawn.position;

  const fileDiff = to.file - from.file;
  const rankDiff = to.rank - from.rank;

  // Forward move (same file)
  if (fileDiff === 0) {
    // One square forward
    if (rankDiff === direction) {
      return !getPieceAtPosition(to, pieces);
    }

    // Two squares forward (initial move only, not if moved as passenger)
    if (rankDiff === 2 * direction && !pawn.hasMoved && !pawn.movedAsPassenger) {
      const intermediatePos: Position = {
        file: from.file,
        rank: from.rank + direction,
        level: from.level,
      };
      return (
        !getPieceAtPosition(to, pieces) &&
        !getPieceAtPosition(intermediatePos, pieces)
      );
    }
  }

  // Diagonal capture (can be on different level)
  if (Math.abs(fileDiff) === 1 && rankDiff === direction) {
    const targetPiece = getPieceAtPosition(to, pieces);
    if (targetPiece && targetPiece.color !== pawn.color) {
      return true;
    }

    // En passant
    if (enPassantTarget && positionsEqual(to, enPassantTarget)) {
      return true;
    }
  }

  return false;
}

/**
 * Knight movement validation
 */
function isValidKnightMove(knight: Piece, to: Position, boards: Board[]): boolean {
  const from = knight.position;

  // Knight can move between levels as part of its L-shape
  // Check all standard L-shaped moves
  for (const move of KNIGHT_MOVES) {
    const targetFile = from.file + move.file;
    const targetRank = from.rank + move.rank;

    if (targetFile === to.file && targetRank === to.rank) {
      // Can be on any level at this position
      return positionExistsOnBoard(to, boards);
    }
  }

  return false;
}

/**
 * Bishop movement validation
 */
function isValidBishopMove(
  bishop: Piece,
  to: Position,
  pieces: Piece[],
  boards: Board[]
): boolean {
  const from = bishop.position;

  const fileDiff = Math.abs(to.file - from.file);
  const rankDiff = Math.abs(to.rank - from.rank);

  // Must move diagonally
  if (fileDiff !== rankDiff) return false;

  // Check if on same level first, then verify path
  if (from.level === to.level) {
    return isPathClear(from, to, pieces, boards);
  }

  // Can change levels at any valid diagonal square
  return true;
}

/**
 * Rook movement validation
 */
function isValidRookMove(
  rook: Piece,
  to: Position,
  pieces: Piece[],
  boards: Board[]
): boolean {
  const from = rook.position;

  const fileDiff = to.file - from.file;
  const rankDiff = to.rank - from.rank;

  // Must move along file or rank (not both)
  if (fileDiff !== 0 && rankDiff !== 0) return false;

  // Check if on same level first, then verify path
  if (from.level === to.level) {
    return isPathClear(from, to, pieces, boards);
  }

  // Can change levels at any valid square along the path
  return true;
}

/**
 * Queen movement validation (combines rook and bishop)
 */
function isValidQueenMove(
  queen: Piece,
  to: Position,
  pieces: Piece[],
  boards: Board[]
): boolean {
  return (
    isValidRookMove(queen, to, pieces, boards) ||
    isValidBishopMove(queen, to, pieces, boards)
  );
}

/**
 * King movement validation
 */
function isValidKingMove(king: Piece, to: Position, boards: Board[]): boolean {
  const from = king.position;

  const fileDiff = Math.abs(to.file - from.file);
  const rankDiff = Math.abs(to.rank - from.rank);

  // King moves one square in any direction, including to adjacent level
  if (fileDiff <= 1 && rankDiff <= 1) {
    return positionExistsOnBoard(to, boards);
  }

  return false;
}

/**
 * Get all valid moves for a piece
 */
export function getValidMoves(
  piece: Piece,
  pieces: Piece[],
  boards: Board[],
  enPassantTarget?: Position
): Position[] {
  const validMoves: Position[] = [];

  // Generate potential moves based on piece type
  const potentialMoves = generatePotentialMoves(piece, boards);

  for (const move of potentialMoves) {
    const result = validateMove(piece, move, pieces, boards, enPassantTarget);
    if (result.valid) {
      validMoves.push(move);
    }
  }

  return validMoves;
}

/**
 * Generate potential move positions for a piece
 */
function generatePotentialMoves(piece: Piece, boards: Board[]): Position[] {
  const moves: Position[] = [];
  const from = piece.position;

  switch (piece.type) {
    case 'pawn':
      generatePawnMoves(piece, boards, moves);
      break;
    case 'knight':
      generateKnightMoves(from, boards, moves);
      break;
    case 'bishop':
      generateSlidingMoves(from, DIAGONAL_DIRS, boards, moves);
      break;
    case 'rook':
      generateSlidingMoves(from, ORTHOGONAL_DIRS, boards, moves);
      break;
    case 'queen':
      generateSlidingMoves(from, [...ORTHOGONAL_DIRS, ...DIAGONAL_DIRS], boards, moves);
      break;
    case 'king':
      generateKingMoves(from, boards, moves);
      break;
  }

  return moves;
}

function generatePawnMoves(pawn: Piece, boards: Board[], moves: Position[]): void {
  const direction = pawn.color === 'white' ? 1 : -1;
  const from = pawn.position;

  // Forward moves (check all levels at target rank)
  // Pawns can advance forward to any valid square at the next rank,
  // potentially crossing between main boards
  for (const board of boards) {
    const oneForward: Position = {
      file: from.file,
      rank: from.rank + direction,
      level: board.level,
    };
    if (positionExistsOnBoard(oneForward, boards)) {
      moves.push(oneForward);
    }

    const twoForward: Position = {
      file: from.file,
      rank: from.rank + 2 * direction,
      level: board.level,
    };
    if (positionExistsOnBoard(twoForward, boards)) {
      moves.push(twoForward);
    }
  }

  // Diagonal captures (all levels)
  for (const fileOffset of [-1, 1]) {
    for (const board of boards) {
      const diagMove: Position = {
        file: from.file + fileOffset,
        rank: from.rank + direction,
        level: board.level,
      };
      if (positionExistsOnBoard(diagMove, boards)) {
        moves.push(diagMove);
      }
    }
  }
}

function generateKnightMoves(from: Position, boards: Board[], moves: Position[]): void {
  for (const move of KNIGHT_MOVES) {
    for (const board of boards) {
      const newPos: Position = {
        file: from.file + move.file,
        rank: from.rank + move.rank,
        level: board.level,
      };
      if (positionExistsOnBoard(newPos, boards)) {
        moves.push(newPos);
      }
    }
  }
}

function generateSlidingMoves(
  from: Position,
  directions: Array<{ file: number; rank: number }>,
  boards: Board[],
  moves: Position[]
): void {
  for (const dir of directions) {
    for (let dist = 1; dist <= 10; dist++) {
      for (const board of boards) {
        const newPos: Position = {
          file: from.file + dir.file * dist,
          rank: from.rank + dir.rank * dist,
          level: board.level,
        };
        if (positionExistsOnBoard(newPos, boards)) {
          moves.push(newPos);
        }
      }
    }
  }
}

function generateKingMoves(from: Position, boards: Board[], moves: Position[]): void {
  for (const move of KING_MOVES) {
    for (const board of boards) {
      const newPos: Position = {
        file: from.file + move.file,
        rank: from.rank + move.rank,
        level: board.level,
      };
      if (positionExistsOnBoard(newPos, boards)) {
        moves.push(newPos);
      }
    }
  }
}

/**
 * Check if a position is under attack by a specific color
 */
export function isPositionUnderAttack(
  position: Position,
  byColor: Color,
  pieces: Piece[],
  boards: Board[]
): boolean {
  const attackingPieces = pieces.filter((p) => p.color === byColor);

  for (const piece of attackingPieces) {
    const result = validateMove(piece, position, pieces, boards);
    if (result.valid) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a king is in check
 */
export function isKingInCheck(kingColor: Color, pieces: Piece[], boards: Board[]): boolean {
  const king = pieces.find((p) => p.type === 'king' && p.color === kingColor);
  if (!king) return false;

  const opponentColor = kingColor === 'white' ? 'black' : 'white';
  return isPositionUnderAttack(king.position, opponentColor, pieces, boards);
}
