/**
 * Test for pawn advancement across board levels
 * This tests the bug where pawns could only advance on their own board
 * but not move forward to neutral or opponent boards
 */

import { describe, it, expect } from 'vitest';
import { getValidMoves, validateMove } from '../../../moveValidation';
import { createTestPiece, createEmptyBoards, parsePosition, boardToASCII } from '../testUtils/boardSetup';

describe('Pawn Cross-Board Advancement - Bug Fix', () => {
  describe('White Pawn Advancement', () => {
    it('should generate forward moves to Neutral board from White board', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b4W'));
      const pieces = [pawn];

      console.log('Initial state (white pawn at b4W):');
      console.log(boardToASCII(pieces, boards));

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Valid moves found:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // Pawn at b4W should be able to move to b5N (crossing to Neutral board)
      const hasNeutralMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 5 && pos.level === 'NL'
      );

      expect(hasNeutralMove).toBe(true);
    });

    it('should generate forward moves to Black board from Neutral board', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b6N'));
      pawn.hasMoved = true; // Mark as moved so we know it's not first move
      const pieces = [pawn];

      console.log('Initial state (white pawn at b6N):');
      console.log(boardToASCII(pieces, boards));

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Valid moves found:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // Pawn at b6N should be able to move to b7B (crossing to Black board)
      const hasBlackMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 7 && pos.level === 'BL'
      );

      expect(hasBlackMove).toBe(true);
    });

    it('should generate two-square initial move across board boundary', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b4W'));
      const pieces = [pawn];

      console.log('Initial state (white pawn at b4W for two-square move):');
      console.log(boardToASCII(pieces, boards));

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Valid moves found:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // Check for both single and two-square moves
      const hasSingleMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 5 && pos.level === 'NL'
      );
      const hasDoubleMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 6 && pos.level === 'NL'
      );

      expect(hasSingleMove).toBe(true);
      expect(hasDoubleMove).toBe(true);
    });
  });

  describe('Black Pawn Advancement', () => {
    it('should generate forward moves to Neutral board from Black board', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'black', parsePosition('b7B'));
      const pieces = [pawn];

      console.log('Initial state (black pawn at b7B):');
      console.log(boardToASCII(pieces, boards));

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Valid moves found:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // Black pawn at b7B should be able to move to b6N (crossing to Neutral board)
      const hasNeutralMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 6 && pos.level === 'NL'
      );

      expect(hasNeutralMove).toBe(true);
    });

    it('should generate forward moves to White board from Neutral board', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'black', parsePosition('b5N'));
      pawn.hasMoved = true;
      const pieces = [pawn];

      console.log('Initial state (black pawn at b5N):');
      console.log(boardToASCII(pieces, boards));

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Valid moves found:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // Black pawn at b5N should be able to move to b4W (crossing to White board)
      const hasWhiteMove = validMoves.some(pos => 
        pos.file === 2 && pos.rank === 4 && pos.level === 'WL'
      );

      expect(hasWhiteMove).toBe(true);
    });
  });

  describe('Validation still works correctly', () => {
    it('validateMove should accept cross-board advancement', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b4W'));
      const pieces = [pawn];

      const result = validateMove(
        pawn,
        parsePosition('b5N'),
        pieces,
        boards
      );

      expect(result.valid).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should not generate moves to non-existent squares', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b9B'));
      const pieces = [pawn];

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      // Rank 10 doesn't exist, so pawn at b9 shouldn't have forward moves
      const hasInvalidMove = validMoves.some(pos => pos.rank >= 10);

      expect(hasInvalidMove).toBe(false);
    });

    it('should include forward moves on all valid levels at target rank', () => {
      const boards = createEmptyBoards();
      const pawn = createTestPiece('pawn', 'white', parsePosition('b5W'));
      const pieces = [pawn];

      const validMoves = getValidMoves(pawn, pieces, boards);
      
      console.log('Pawn at b5W - checking rank 6 on both W and N levels');
      console.log('Valid moves:', validMoves.map(pos => 
        `${['z','a','b','c','d','e'][pos.file]}${pos.rank}${pos.level}`
      ).join(', '));

      // At rank 6, the square exists on both WL and NL
      // Pawn should be able to choose which level to move to
      const movesToRank6 = validMoves.filter(pos => 
        pos.file === 2 && pos.rank === 6
      );

      // Should have moves to rank 6 (potentially on multiple levels)
      expect(movesToRank6.length).toBeGreaterThan(0);
    });
  });
});

