/**
 * Debug test for pawn movement issues
 */

import { describe, it, expect } from 'vitest';
import { validateMove } from '../../../moveValidation';
import { createTestPiece, createEmptyBoards, parsePosition, boardToASCII } from '../testUtils/boardSetup';

describe('Pawn Movement - Debug', () => {
  it('should allow pawn to move forward one square on same board', () => {
    const boards = createEmptyBoards();
    const pawn = createTestPiece('pawn', 'white', parsePosition('b3W'));
    const pieces = [pawn];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      pawn,
      parsePosition('b4W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> b4W: ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow pawn to move between boards (W -> N)', () => {
    const boards = createEmptyBoards();
    const pawn = createTestPiece('pawn', 'white', parsePosition('b4W'));
    const pieces = [pawn];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      pawn,
      parsePosition('b5N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> b5N (crossing to Neutral board): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow pawn two-square initial move', () => {
    const boards = createEmptyBoards();
    const pawn = createTestPiece('pawn', 'white', parsePosition('b3W'));
    const pieces = [pawn];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      pawn,
      parsePosition('b5N'),
      pieces,
      boards
    );

    console.log(`Move b3W -> b5N (two squares): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow pawn diagonal capture to different board', () => {
    const boards = createEmptyBoards();
    const pawn = createTestPiece('pawn', 'white', parsePosition('b4W'));
    const enemyPiece = createTestPiece('pawn', 'black', parsePosition('c5N'));
    const pieces = [pawn, enemyPiece];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      pawn,
      parsePosition('c5N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> c5N (diagonal capture to Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow black pawn to move between boards (B -> N)', () => {
    const boards = createEmptyBoards();
    const pawn = createTestPiece('pawn', 'black', parsePosition('b7B'));
    const pieces = [pawn];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      pawn,
      parsePosition('b6N'),
      pieces,
      boards
    );

    console.log(`Move b7B -> b6N (black pawn crossing to Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });
});
