/**
 * Core type definitions for 3D Chess game engine
 * Independent of React/UI - can be used for multiplayer and AI
 */

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type Color = 'white' | 'black';
export type BoardType = 'main' | 'attack';

/**
 * 3D Coordinate system
 * - file: z, a, b, c, d, e (0-5)
 * - rank: 0-9
 * - level: board level identifier
 */
export interface Position {
  file: number; // 0-5 representing z,a,b,c,d,e
  rank: number; // 0-9
  level: string; // e.g., 'WL', 'NL', 'BL', 'WQL', 'WKL', 'BQL', 'BKL'
}

export interface Piece {
  id: string;
  type: PieceType;
  color: Color;
  position: Position;
  hasMoved: boolean; // For castling, pawn double-move, etc.
  movedAsPassenger?: boolean; // Pawn moved on attack board
}

/**
 * Main boards: White's Level (WL), Neutral Level (NL), Black's Level (BL)
 * Attack boards: White Queen Level (WQL), White King Level (WKL), etc.
 */
export interface Board {
  id: string;
  type: BoardType;
  level: string;
  position?: AttackBoardPosition; // Only for attack boards
  files: number; // 4 for main, 2 for attack
  ranks: number; // 4 for main, 2 for attack
}

/**
 * Attack board position on the grid
 * Represents which "pin" position the attack board occupies
 */
export interface AttackBoardPosition {
  fileOffset: number; // 0-4 (z through e, with attack board being 2x2)
  rankOffset: number; // 0-8 (allowing overhang to rank 9)
  level: 'white' | 'neutral' | 'black'; // Which main board level it's attached to
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotionType?: PieceType;
  attackBoardMove?: AttackBoardMove;
}

export interface AttackBoardMove {
  boardId: string;
  from: AttackBoardPosition;
  to: AttackBoardPosition;
}

export interface GameState {
  pieces: Piece[];
  boards: Board[];
  currentTurn: Color;
  moveHistory: Move[];
  selectedPiece?: Piece;
  validMoves: Position[];
  check?: Color;
  checkmate?: Color;
  stalemate: boolean;
  enPassantTarget?: Position; // Square where en passant is possible this turn
}

export interface MoveValidationResult {
  valid: boolean;
  reason?: string;
  capturedPiece?: Piece;
}

/**
 * Initial board setup configuration
 */
export interface InitialSetup {
  pieces: Omit<Piece, 'id'>[];
  boards: Board[];
}

/**
 * Serializable game state for network transmission and storage
 */
export type SerializableGameState = Omit<GameState, 'selectedPiece' | 'validMoves'>;
