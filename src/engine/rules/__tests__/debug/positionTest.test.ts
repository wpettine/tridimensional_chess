/**
 * Debug test for position parsing and validation
 */

import { describe, it, expect } from 'vitest';
import { parsePosition, positionExists, createEmptyBoards } from '../testUtils/boardSetup';
import { BOARD_DEFINITIONS } from '../../../coordinateSystem';

describe('Position System - Debug', () => {
  it('should parse b3W correctly', () => {
    const pos = parsePosition('b3W');
    console.log('Parsed b3W:', pos);
    console.log('Expected: file=2 (b), rank=3, level=WL');

    expect(pos.file).toBe(2); // 'b' is index 2 in ['z', 'a', 'b', 'c', 'd', 'e']
    expect(pos.rank).toBe(3);
    expect(pos.level).toBe('WL');
  });

  it('should validate b3W exists on WL board', () => {
    const boards = createEmptyBoards();
    const pos = parsePosition('b3W');
    const exists = positionExists(pos, boards);

    console.log('Position b3W:', pos);
    console.log('WL board definition:', BOARD_DEFINITIONS['WL']);
    console.log('Does b3W exist?', exists);

    expect(exists).toBe(true);
  });

  it('should validate b4W exists on WL board', () => {
    const boards = createEmptyBoards();
    const pos = parsePosition('b4W');
    const exists = positionExists(pos, boards);

    console.log('Position b4W:', pos);
    console.log('Does b4W exist?', exists);

    expect(exists).toBe(true);
  });

  it('should validate b5N exists on NL board', () => {
    const boards = createEmptyBoards();
    const pos = parsePosition('b5N');
    const exists = positionExists(pos, boards);

    console.log('Position b5N:', pos);
    console.log('NL board definition:', BOARD_DEFINITIONS['NL']);
    console.log('Does b5N exist?', exists);

    expect(exists).toBe(true);
  });

  it('should show all board definitions', () => {
    console.log('\n=== ALL BOARD DEFINITIONS ===');
    for (const [key, def] of Object.entries(BOARD_DEFINITIONS)) {
      console.log(`\n${key}:`);
      console.log(`  Files: ${def.globalFileRange.min}-${def.globalFileRange.max}`);
      console.log(`  Ranks: ${def.globalRankRange.min}-${def.globalRankRange.max}`);
    }
  });
});
