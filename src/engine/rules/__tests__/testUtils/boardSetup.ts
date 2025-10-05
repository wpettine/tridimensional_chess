/**
 * Test utilities for board setup and piece placement
 */

import type { Piece, Board, Position, PieceType, Color } from '../../../types';
import { BOARD_DEFINITIONS } from '../../../coordinateSystem';
import { LEVEL_IDS } from '../../../constants';

/**
 * Create an empty set of boards
 */
export function createEmptyBoards(): Board[] {
  return [
    { level: LEVEL_IDS.WHITE_MAIN, type: 'main' as const },
    { level: LEVEL_IDS.NEUTRAL_MAIN, type: 'main' as const },
    { level: LEVEL_IDS.BLACK_MAIN, type: 'main' as const },
    {
      level: LEVEL_IDS.WHITE_QUEEN_ATTACK,
      type: 'attack' as const,
      position: { fileOffset: 0, rankOffset: 0 },
    },
    {
      level: LEVEL_IDS.WHITE_KING_ATTACK,
      type: 'attack' as const,
      position: { fileOffset: 3, rankOffset: 0 },
    },
    {
      level: LEVEL_IDS.BLACK_QUEEN_ATTACK,
      type: 'attack' as const,
      position: { fileOffset: 0, rankOffset: 9 },
    },
    {
      level: LEVEL_IDS.BLACK_KING_ATTACK,
      type: 'attack' as const,
      position: { fileOffset: 3, rankOffset: 9 },
    },
  ];
}

/**
 * Create a test piece
 */
export function createTestPiece(
  type: PieceType,
  color: Color,
  position: Position,
  id?: string
): Piece {
  return {
    id: id || `test-${type}-${color}-${Date.now()}`,
    type,
    color,
    position,
  };
}

/**
 * Place multiple pieces on the board
 */
export function placePieces(pieces: Piece[]): Piece[] {
  return [...pieces];
}

/**
 * Create a position from algebraic notation (e.g., "c1W" or "a8BQL")
 * Notation uses short codes: W, N, B for main boards
 * But internally we use WL, NL, BL for board IDs
 */
export function parsePosition(notation: string): Position {
  const match = notation.match(/^([zabcde])(\d+)(\w+)$/);
  if (!match) {
    throw new Error(`Invalid position notation: ${notation}`);
  }

  const files = ['z', 'a', 'b', 'c', 'd', 'e'];
  const file = files.indexOf(match[1]);
  const rank = parseInt(match[2], 10);
  let level = match[3];

  // Convert short notation to full board IDs
  const levelMap: Record<string, string> = {
    'W': 'WL',
    'N': 'NL',
    'B': 'BL',
    'WQL': 'WQL',
    'WKL': 'WKL',
    'BQL': 'BQL',
    'BKL': 'BKL',
  };

  level = levelMap[level] || level;

  if (file === -1) {
    throw new Error(`Invalid file in notation: ${notation}`);
  }

  return { file, rank, level };
}

/**
 * Convert position to algebraic notation
 */
export function toAlgebraic(position: Position): string {
  const files = ['z', 'a', 'b', 'c', 'd', 'e'];
  return `${files[position.file]}${position.rank}${position.level}`;
}

/**
 * Generate ASCII representation of boards for debugging
 */
export function boardToASCII(pieces: Piece[], boards: Board[]): string {
  let output = '\n';

  const levels = [
    LEVEL_IDS.BLACK_MAIN,
    LEVEL_IDS.NEUTRAL_MAIN,
    LEVEL_IDS.WHITE_MAIN,
  ];

  for (const levelId of levels) {
    output += `\n=== ${levelId} ===\n`;
    const boardDef = BOARD_DEFINITIONS[levelId];
    if (!boardDef) continue;

    const { globalFileRange, globalRankRange } = boardDef;

    // Print rank numbers
    output += '   ';
    for (let file = globalFileRange.min; file <= globalFileRange.max; file++) {
      output += ` ${'zabcde'[file]} `;
    }
    output += '\n';

    // Print board from top rank to bottom rank
    for (let rank = globalRankRange.max; rank >= globalRankRange.min; rank--) {
      output += `${rank.toString().padStart(2, ' ')} `;
      for (let file = globalFileRange.min; file <= globalFileRange.max; file++) {
        const piece = pieces.find(
          (p) => p.position.file === file && p.position.rank === rank && p.position.level === levelId
        );
        if (piece) {
          const symbol = getPieceSymbol(piece);
          output += ` ${symbol} `;
        } else {
          output += ' . ';
        }
      }
      output += `\n`;
    }
  }

  return output;
}

/**
 * Get ASCII symbol for a piece
 */
function getPieceSymbol(piece: Piece): string {
  const symbols = {
    white: { pawn: 'P', rook: 'R', knight: 'N', bishop: 'B', queen: 'Q', king: 'K' },
    black: { pawn: 'p', rook: 'r', knight: 'n', bishop: 'b', queen: 'q', king: 'k' },
  };
  return symbols[piece.color][piece.type] || '?';
}

/**
 * Check if a position exists on the boards
 */
export function positionExists(position: Position, boards: Board[]): boolean {
  const boardDef = BOARD_DEFINITIONS[position.level];
  if (!boardDef) return false;

  return (
    position.file >= boardDef.globalFileRange.min &&
    position.file <= boardDef.globalFileRange.max &&
    position.rank >= boardDef.globalRankRange.min &&
    position.rank <= boardDef.globalRankRange.max
  );
}
