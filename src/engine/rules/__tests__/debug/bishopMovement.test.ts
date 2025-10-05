/**
 * Debug test for bishop movement
 */

import { describe, it, expect } from 'vitest';
import { validateMove } from '../../../moveValidation';
import { createTestPiece, createEmptyBoards, parsePosition, boardToASCII } from '../testUtils/boardSetup';

describe('Bishop Movement - Debug', () => {
  it('should allow bishop to move diagonally on same board', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('b3W'));
    const pieces = [bishop];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('d5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> d5W (diagonal +2,+2): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow bishop to move diagonally between boards', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('b4W'));
    const pieces = [bishop];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('c5N'),
      pieces,
      boards
    );

    console.log(`Move b4W -> c5N (diagonal crossing to Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should allow bishop to capture on different board', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('b3W'));
    const enemyPiece = createTestPiece('pawn', 'black', parsePosition('d5N'));
    const pieces = [bishop, enemyPiece];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('d5N'),
      pieces,
      boards
    );

    console.log(`Move b3W -> d5N (capture on Neutral): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });

  it('should block bishop if path is obstructed on same level', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('b3W'));
    const blockingPiece = createTestPiece('pawn', 'white', parsePosition('c4W'));
    const pieces = [bishop, blockingPiece];

    console.log('Initial state (own pawn blocking path):');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('d5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> d5W (blocked by c4W): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(false);
  });

  it('should prevent non-diagonal moves', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('b3W'));
    const pieces = [bishop];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('b5W'),
      pieces,
      boards
    );

    console.log(`Move b3W -> b5W (straight - should be invalid): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(false);
  });

  it('should allow bishop to move along opposite diagonal', () => {
    const boards = createEmptyBoards();
    const bishop = createTestPiece('bishop', 'white', parsePosition('c4W'));
    const pieces = [bishop];

    console.log('Initial state:');
    console.log(boardToASCII(pieces, boards));

    const result = validateMove(
      bishop,
      parsePosition('a2W'),
      pieces,
      boards
    );

    console.log(`Move c4W -> a2W (diagonal -2,-2): ${result.valid ? 'VALID' : 'INVALID'}`);
    if (!result.valid) {
      console.log(`Reason: ${result.reason}`);
    }

    expect(result.valid).toBe(true);
  });
});
