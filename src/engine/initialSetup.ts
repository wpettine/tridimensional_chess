/**
 * Initial game setup - piece positions for standard 3D chess
 * Uses board-local coordinates with coordinateSystem conversion
 */

import type { Piece, Board } from './types';
import { INITIAL_BOARDS, INITIAL_PIECE_POSITIONS } from './constants';
import { boardLocalToGlobal } from './coordinateSystem';

/**
 * Create initial piece setup for 3D chess using data-driven approach
 * Iterates through INITIAL_PIECE_POSITIONS and converts board-local
 * coordinates to global positions using the coordinate system
 */
export function createInitialPieces(): Piece[] {
  const pieces: Piece[] = [];

  // Iterate through master data structure and place each piece
  INITIAL_PIECE_POSITIONS.forEach((pieceData, index) => {
    const globalPosition = boardLocalToGlobal(
      pieceData.board,
      pieceData.x,
      pieceData.y
    );

    pieces.push({
      id: `piece-${index}`,
      type: pieceData.piece,
      color: pieceData.color,
      position: globalPosition,
      hasMoved: false,
    });
  });

  console.log(`[InitialSetup] Created ${pieces.length} pieces from INITIAL_PIECE_POSITIONS`);
  console.log('[InitialSetup] First 5 pieces:', pieces.slice(0, 5));
  console.log('[InitialSetup] White King:', pieces.find(p => p.type === 'king' && p.color === 'white'));
  console.log('[InitialSetup] Black King:', pieces.find(p => p.type === 'king' && p.color === 'black'));

  return pieces;
}

/**
 * Create initial boards configuration
 */
export function createInitialBoards(): Board[] {
  return INITIAL_BOARDS.map((board) => ({ ...board }));
}

/**
 * Create complete initial game setup
 * This is the main entry point for setting up a new game
 */
export function createInitialGameSetup() {
  return {
    pieces: createInitialPieces(),
    boards: createInitialBoards(),
  };
}
