/**
 * Core game engine for 3D Chess
 * Pure TypeScript logic - no React dependencies
 */

import type {
  GameState,
  Piece,
  Position,
  Move,
  Color,
  SerializableGameState,
} from './types';
import { createInitialPieces, createInitialBoards } from './initialSetup';
import {
  validateMove,
  getValidMoves,
  isKingInCheck,
} from './moveValidation';
import { getPieceAtPosition, positionsEqual } from './boardUtils';

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  return {
    pieces: createInitialPieces(),
    boards: createInitialBoards(),
    currentTurn: 'white',
    moveHistory: [],
    validMoves: [],
    stalemate: false,
  };
}

/**
 * Execute a move and return new game state
 */
export function executeMove(
  state: GameState,
  piece: Piece,
  to: Position
): GameState | null {
  const validation = validateMove(
    piece,
    to,
    state.pieces,
    state.boards,
    state.enPassantTarget
  );

  if (!validation.valid) {
    console.warn('Invalid move:', validation.reason);
    return null;
  }

  // Create new state
  const newPieces = state.pieces.map((p) => ({ ...p, position: { ...p.position } }));
  const movingPiece = newPieces.find((p) => p.id === piece.id)!;

  // Handle capture
  let capturedPiece = validation.capturedPiece;
  if (capturedPiece) {
    const captureIndex = newPieces.findIndex((p) => p.id === capturedPiece!.id);
    newPieces.splice(captureIndex, 1);
  }

  // Handle en passant
  if (piece.type === 'pawn' && state.enPassantTarget && positionsEqual(to, state.enPassantTarget)) {
    const direction = piece.color === 'white' ? -1 : 1;
    const capturedPawnPos: Position = {
      ...state.enPassantTarget,
      rank: state.enPassantTarget.rank + direction,
    };
    const capturedPawn = getPieceAtPosition(capturedPawnPos, newPieces);
    if (capturedPawn) {
      const captureIndex = newPieces.findIndex((p) => p.id === capturedPawn.id);
      newPieces.splice(captureIndex, 1);
      capturedPiece = capturedPawn;
    }
  }

  // Update piece position
  const oldPosition = { ...movingPiece.position };
  movingPiece.position = { ...to };
  movingPiece.hasMoved = true;

  // Check for en passant setup (pawn moves two squares)
  let enPassantTarget: Position | undefined;
  if (piece.type === 'pawn') {
    const rankDiff = Math.abs(to.rank - oldPosition.rank);
    if (rankDiff === 2) {
      const direction = piece.color === 'white' ? 1 : -1;
      enPassantTarget = {
        file: to.file,
        rank: oldPosition.rank + direction,
        level: to.level,
      };
    }
  }

  // Handle pawn promotion
  if (piece.type === 'pawn' && isPawnAtPromotionRank(to, piece.color, state.boards)) {
    // For now, auto-promote to queen (UI will handle choice later)
    movingPiece.type = 'queen';
  }

  // Create move record
  const move: Move = {
    piece: { ...piece },
    from: oldPosition,
    to: { ...to },
    capturedPiece,
    promotionType: movingPiece.type !== piece.type ? movingPiece.type : undefined,
  };

  // Check if move puts own king in check (illegal)
  if (isKingInCheck(piece.color, newPieces, state.boards)) {
    return null; // Illegal move - leaves king in check
  }

  // Determine check/checkmate for opponent
  const nextTurn = piece.color === 'white' ? 'black' : 'white';
  const opponentInCheck = isKingInCheck(nextTurn, newPieces, state.boards);

  let checkmate: Color | undefined;
  let stalemate = false;

  if (opponentInCheck || hasNoLegalMoves(nextTurn, newPieces, state.boards)) {
    if (opponentInCheck && hasNoLegalMoves(nextTurn, newPieces, state.boards)) {
      checkmate = piece.color; // Current player wins
    } else if (!opponentInCheck && hasNoLegalMoves(nextTurn, newPieces, state.boards)) {
      stalemate = true;
    }
  }

  return {
    pieces: newPieces,
    boards: state.boards,
    currentTurn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    validMoves: [],
    check: opponentInCheck ? nextTurn : undefined,
    checkmate,
    stalemate,
    enPassantTarget,
  };
}

/**
 * Select a piece and get valid moves
 */
export function selectPiece(state: GameState, piece: Piece): GameState {
  if (piece.color !== state.currentTurn) {
    return state;
  }

  const allMoves = getValidMoves(
    piece,
    state.pieces,
    state.boards,
    state.enPassantTarget
  );

  console.log(`Generated ${allMoves.length} potential moves for ${piece.type} at ${piece.position.file},${piece.position.rank},${piece.position.level}`);
  allMoves.forEach(move => {
    console.log(`  - Move to ${move.file},${move.rank},${move.level}`);
  });

  const validMoves = allMoves.filter((move) => {
    // Filter out moves that would put own king in check
    const testState = executeMove(state, piece, move);
    return testState !== null;
  });

  console.log(`After filtering: ${validMoves.length} valid moves`);

  return {
    ...state,
    selectedPiece: piece,
    validMoves,
  };
}

/**
 * Deselect current piece
 */
export function deselectPiece(state: GameState): GameState {
  return {
    ...state,
    selectedPiece: undefined,
    validMoves: [],
  };
}

/**
 * Check if pawn is at promotion rank
 */
function isPawnAtPromotionRank(position: Position, color: Color, _boards: any[]): boolean { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const { file, rank } = position;

  // Central files (b, c) promote at rank 1 (black) or 8 (white)
  if (file === 2 || file === 3) {
    return (color === 'white' && rank === 8) || (color === 'black' && rank === 1);
  }

  // Outer files (z, a, d, e) - depends on attack board presence
  // For now, use rank 0/9 (simplified - full implementation would check attack boards)
  return (color === 'white' && rank === 9) || (color === 'black' && rank === 0);
}

/**
 * Check if a player has no legal moves
 */
function hasNoLegalMoves(color: Color, pieces: Piece[], boards: any[]): boolean { // eslint-disable-line @typescript-eslint/no-explicit-any
  const playerPieces = pieces.filter((p) => p.color === color);

  for (const piece of playerPieces) {
    const moves = getValidMoves(piece, pieces, boards);
    if (moves.length > 0) {
      // Need to verify these moves don't leave king in check
      for (const move of moves) {
        const testPieces = pieces.map((p) => ({ ...p, position: { ...p.position } }));
        const testPiece = testPieces.find((p) => p.id === piece.id)!;
        testPiece.position = move;

        // Remove captured piece if any
        const captured = getPieceAtPosition(move, testPieces);
        if (captured && captured.id !== piece.id) {
          const captureIndex = testPieces.findIndex((p) => p.id === captured.id);
          testPieces.splice(captureIndex, 1);
        }

        if (!isKingInCheck(color, testPieces, boards)) {
          return false; // Found a legal move
        }
      }
    }
  }

  return true;
}

/**
 * Serialize game state for storage/transmission
 */
export function serializeGameState(state: GameState): SerializableGameState {
  return {
    pieces: state.pieces,
    boards: state.boards,
    currentTurn: state.currentTurn,
    moveHistory: state.moveHistory,
    check: state.check,
    checkmate: state.checkmate,
    stalemate: state.stalemate,
    enPassantTarget: state.enPassantTarget,
  };
}

/**
 * Deserialize game state from storage/transmission
 */
export function deserializeGameState(serialized: SerializableGameState): GameState {
  return {
    ...serialized,
    validMoves: [],
  };
}

/**
 * Undo last move
 */
export function undoLastMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) {
    return state;
  }

  // For now, recreate game from scratch up to previous move
  // More efficient implementation would reverse the move directly
  let newState = createInitialGameState();

  for (let i = 0; i < state.moveHistory.length - 1; i++) {
    const move = state.moveHistory[i];
    const piece = newState.pieces.find((p) =>
      positionsEqual(p.position, move.from)
    );
    if (piece) {
      const result = executeMove(newState, piece, move.to);
      if (result) {
        newState = result;
      }
    }
  }

  return newState;
}
