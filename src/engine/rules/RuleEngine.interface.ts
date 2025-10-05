/**
 * Rule Engine Interface
 *
 * Defines the contract for different rule systems for Tri-Dimensional Chess.
 * Based on Jens Meder's Tournament Rules formal specification.
 */

import type { Position, Piece, Board, GameState, Move, PieceType } from '../types';

/**
 * Result of a move validation
 */
export interface MoveValidationResult {
  isValid: boolean;
  reason?: string; // Explanation if invalid
  requiresPromotion?: boolean;
  isEnPassant?: boolean;
  isCastling?: boolean;
}

/**
 * Game outcome types
 */
export type GameOutcome =
  | { type: 'ongoing' }
  | { type: 'checkmate'; winner: 'white' | 'black' }
  | { type: 'stalemate' }
  | { type: 'draw'; reason: string };

/**
 * Attack board movement information
 */
export interface AttackBoardMove {
  boardId: string;
  newPosition: { fileOffset: number; rankOffset: number };
  isValid: boolean;
  reason?: string;
}

/**
 * Core interface for chess rule engines
 */
export interface RuleEngine {
  /**
   * Get all valid moves for a specific piece
   * Section 3: Piece-Specific Movement Protocols
   */
  getValidMoves(piece: Piece, pieces: Piece[], boards: Board[]): Position[];

  /**
   * Validate if a specific move is legal
   * Accounts for all movement rules, blocking, and game state
   */
  isValidMove(
    from: Position,
    to: Position,
    piece: Piece,
    pieces: Piece[],
    boards: Board[],
    gameState: GameState
  ): MoveValidationResult;

  /**
   * Check if a position is under attack by the specified color
   * Used for check detection and castling validation
   */
  isSquareAttacked(
    position: Position,
    byColor: 'white' | 'black',
    pieces: Piece[],
    boards: Board[]
  ): boolean;

  /**
   * Determine if the specified player is in check
   * Section 5.3: Game State Resolution
   */
  isInCheck(color: 'white' | 'black', pieces: Piece[], boards: Board[]): boolean;

  /**
   * Determine current game outcome
   * Section 5.3: Checkmate and Stalemate
   */
  getGameOutcome(gameState: GameState, pieces: Piece[], boards: Board[]): GameOutcome;

  /**
   * Get all valid attack board moves for the current player
   * Section 4: Attack Board Manipulation
   */
  getValidAttackBoardMoves(
    currentPlayer: 'white' | 'black',
    pieces: Piece[],
    boards: Board[]
  ): AttackBoardMove[];

  /**
   * Validate if an attack board move is legal
   * Section 4.1-4.4: Attack Board Movement Rules
   */
  isValidAttackBoardMove(
    boardId: string,
    newPosition: { fileOffset: number; rankOffset: number },
    currentPlayer: 'white' | 'black',
    pieces: Piece[],
    boards: Board[]
  ): MoveValidationResult;

  /**
   * Check if a vertical column is blocked
   * Section 2.2: The "Vertical Shadow" Principle
   */
  isVerticalColumnBlocked(
    file: number,
    rank: number,
    pieces: Piece[],
    excludePiece?: Piece
  ): boolean;

  /**
   * Check if a path between two positions is clear
   * Accounts for vertical shadow blocking
   */
  isPathClear(
    from: Position,
    to: Position,
    piece: Piece,
    pieces: Piece[],
    boards: Board[]
  ): boolean;

  /**
   * Get the promotion rank for a pawn
   * Section 3.6, Table 2: Dynamic Pawn Promotion Ranks
   */
  getPromotionRank(
    pawn: Piece,
    boards: Board[]
  ): number;

  /**
   * Validate castling move
   * Section 5.1: Castling
   */
  canCastle(
    king: Piece,
    rook: Piece,
    pieces: Piece[],
    boards: Board[],
    gameState: GameState
  ): boolean;

  /**
   * Validate en passant capture
   * Section 5.2: En Passant with 3D extension
   */
  canEnPassant(
    pawn: Piece,
    targetPosition: Position,
    gameState: GameState,
    pieces: Piece[],
    boards: Board[]
  ): boolean;
}

/**
 * Extended game state for rule-specific tracking
 */
export interface ExtendedGameState extends GameState {
  // Track which pieces have moved (for castling and pawn two-square move)
  piecesMoved: Set<string>; // piece IDs

  // Track pawns that have been passengers on attack boards
  // (lose two-square move privilege per Section 3.6)
  pawnPassengers: Set<string>; // pawn IDs

  // Last move for en passant validation
  lastMove?: {
    piece: Piece;
    from: Position;
    to: Position;
    wasTwoSquarePawnMove: boolean;
  };
}
