/**
 * Debug test for knight movement
 */

import { describe, it, expect } from 'vitest';
import { validateMove } from '../../../moveValidation';
import { createTestPiece, createEmptyBoards, parsePosition, boardToASCII } from '../testUtils/boardSetup';

describe('Knight Movement - Debug', () => {
  it('should allow knight L-shaped move on same board', () => {
    const boards = createEmptyBoards();
    const knight = createTestPiece('knight', 'white', parsePosition('b3W'));
    const pieces = [knight];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      knight,
      parsePosition('c5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> c5W (L-shape: +1 file, +2 ranks): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow knight to jump over pieces', () => {
    const boards = createEmptyBoards();
    const knight = createTestPiece('knight', 'white', parsePosition('b3W'));
    const blockingPiece = createTestPiece('pawn', 'white', parsePosition('b4W'));
    const pieces = [knight, blockingPiece];

    console.log('Initial state (pawn blocking path):');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      knight,
      parsePosition('c5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> c5W (jumping over b4W): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow knight to move between boards', () => {
    const boards = createEmptyBoards();
    const knight = createTestPiece('knight', 'white', parsePosition('b4W'));
    const pieces = [knight];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      knight,
      parsePosition('c6N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> c6N (L-shape crossing to Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow knight to capture on different board', () => {
    const boards = createEmptyBoards();
    const knight = createTestPiece('knight', 'white', parsePosition('b4W'));
    const enemyPiece = createTestPiece('pawn', 'black', parsePosition('c6N'));
    const pieces = [knight, enemyPiece];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      knight,
      parsePosition('c6N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> c6N (capture on Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should ignore vertical shadow blocking (knight immunity)', () => {
    const boards = createEmptyBoards();
    const knight = createTestPiece('knight', 'white', parsePosition('b4W'));
    const blockingPiece = createTestPiece('pawn', 'black', parsePosition('c6B'));
    const pieces = [knight, blockingPiece];

    console.log('Initial state (piece at c6B creates vertical shadow):');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      knight,
      parsePosition('c6N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> c6N (should ignore vertical shadow from c6B): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });
});
