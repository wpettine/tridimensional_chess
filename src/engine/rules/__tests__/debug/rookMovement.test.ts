/**
 * Debug test for rook movement
 */

import { describe, it, expect } from 'vitest';
import { validateMove } from '../../../moveValidation';
import { createTestPiece, createEmptyBoards, parsePosition, boardToASCII } from '../testUtils/boardSetup';

describe('Rook Movement - Debug', () => {
  it('should allow rook to move along file on same board', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b3W'));
    const pieces = [rook];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('d3W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> d3W (along file): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow rook to move along rank on same board', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b3W'));
    const pieces = [rook];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('b5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> b5W (along rank): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow rook to move between boards along rank', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b4W'));
    const pieces = [rook];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('b6N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> b6N (crossing to Neutral along rank): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow rook to capture on different board', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b4W'));
    const enemyPiece = createTestPiece('pawn', 'black', parsePosition('b6N'));
    const pieces = [rook, enemyPiece];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('b6N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> b6N (capture on Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should block rook if path is obstructed on same level', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b3W'));
    const blockingPiece = createTestPiece('pawn', 'white', parsePosition('b4W'));
    const pieces = [rook, blockingPiece];

    console.log('Initial state (own pawn blocking path):');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('b5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> b5W (blocked by b4W): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(false);
  });

  it('should prevent diagonal moves', () => {
    const boards = createEmptyBoards();
    const rook = createTestPiece('rook', 'white', parsePosition('b3W'));
    const pieces = [rook];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      rook,
      parsePosition('c4W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> c4W (diagonal - should be invalid): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(false);
  });
});
