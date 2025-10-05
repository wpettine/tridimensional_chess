# Testing & Rule Engine Implementation Plan

## Overview
This document outlines the complete implementation plan for creating a robust rule engine abstraction and comprehensive test suite based on Meder's Tournament Rules specification.

## Phase 1: Rule Engine Abstraction ✅ COMPLETE

### 1.1 Interface Definition ✅
- **File**: `src/engine/rules/RuleEngine.interface.ts` (CREATED)
- Defines complete contract for rule engines
- Includes extended game state for tracking move history

### 1.2 Extract Current Logic → MederTournamentRules
**File**: `src/engine/rules/MederTournamentRules.ts` (TO CREATE)

Move existing logic from these files:
- `src/engine/moves/pieceMoves.ts` → `getValidMoves()` method
- `src/engine/moves/moveValidation.ts` → `isValidMove()` method
- `src/engine/boardUtils.ts` → helper methods
- `src/engine/gameLogic.ts` → `getGameOutcome()`, `isInCheck()`

Keep all logic intact, just reorganize into class structure.

### 1.3 Update Game State
**File**: `src/engine/types.ts` (TO MODIFY)

Add Extended fields:
```typescript
export interface GameState {
  // ... existing fields
  piecesMoved: Set<string>;
  pawnPassengers: Set<string>;
  lastMove?: {
    piece: Piece;
    from: Position;
    to: Position;
    wasTwoSquarePawnMove: boolean;
  };
}
```

## Phase 2: Test Framework Setup

### 2.1 Test Utilities
**File**: `src/engine/rules/__tests__/testUtils/boardSetup.ts`

```typescript
// Helper functions for creating test scenarios
export function createEmptyBoard(): Board[]
export function placePiece(board: Board[], piece: Piece, position: Position): void
export function createTestPiece(type: PieceType, color: Color, position: Position, id?: string): Piece
export function setupScenario(description: string): TestScenario
export function boardToASCII(pieces: Piece[], boards: Board[]): string // For debugging
```

**File**: `src/engine/rules/__tests__/testUtils/assertions.ts`

```typescript
export function assertValidMoves(actual: Position[], expected: Position[]): void
export function assertMoveValid(result: MoveValidationResult): void
export function assertMoveInvalid(result: MoveValidationResult, expectedReason?: string): void
export function assertInCheck(color: Color, pieces: Piece[], boards: Board[]): void
export function assertCheckmate(color: Color, pieces: Piece[], boards: Board[]): void
```

**File**: `src/engine/rules/__tests__/testUtils/fixtures.ts`

Pre-defined board scenarios:
- Empty boards
- Starting position
- Congested mid-game positions
- Endgame scenarios
- Edge cases (pieces at board boundaries, etc.)

### 2.2 Install Testing Framework
```bash
npm install --save-dev vitest @vitest/ui
```

Configure in `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

## Phase 3: Core Test Implementation

### 3.1 Rook Tests (Section 3.1 of spec)
**File**: `src/engine/rules/__tests__/meder/rook.test.ts`

Test cases:
- ✅ T-ROOK-001: Valid straight-line move on same level
- ✅ T-ROOK-002: Valid move crossing between boards
- ✅ T-ROOK-003: Move blocked by piece on same level
- ✅ T-ROOK-004: Move blocked by vertical shadow from different level
- ❌ T-ROOK-005: Invalid purely vertical move (b2W → b2N)
- ❌ T-ROOK-006: Invalid diagonal move
- ✅ T-ROOK-007: Valid capture on different level
- ❌ T-ROOK-008: Move to non-existent square

### 3.2 Bishop Tests (Section 3.2)
**File**: `src/engine/rules/__tests__/meder/bishop.test.ts`

Test cases:
- ✅ T-BISHOP-001: Valid diagonal move on same level
- ✅ T-BISHOP-002: Valid diagonal move crossing levels
- ✅ T-BISHOP-003: Move blocked by piece in diagonal path
- ✅ T-BISHOP-004: Move blocked by vertical shadow
- ❌ T-BISHOP-005: Invalid straight-line move
- ❌ T-BISHOP-006: Invalid purely vertical move

### 3.3 Queen Tests (Section 3.3)
**File**: `src/engine/rules/__tests__/meder/queen.test.ts`

Combination of Rook and Bishop test scenarios

### 3.4 King Tests (Section 3.4)
**File**: `src/engine/rules/__tests__/meder/king.test.ts`

Test cases:
- ✅ T-KING-001: Valid one-square moves in all directions
- ✅ T-KING-002: Valid move to adjacent level
- ❌ T-KING-003: Invalid move into check
- ❌ T-KING-004: Invalid two-square move (not castling)
- ✅ T-KING-005: Castling kingside
- ✅ T-KING-006: Castling queenside
- ❌ T-KING-007: Castling through check
- ❌ T-KING-008: Castling when pieces have moved

### 3.5 Knight Tests (Section 3.5) ⭐ CRITICAL
**File**: `src/engine/rules/__tests__/meder/knight.test.ts`

Test cases:
- ✅ T-KNIGHT-001: Valid L-shape moves on same level
- ✅ T-KNIGHT-002: Valid L-shape move crossing levels
- ✅ T-KNIGHT-003: Move succeeds despite vertical shadow blocking (immunity test)
- ✅ T-KNIGHT-004: Move through congested multi-level position
- ❌ T-KNIGHT-005: Invalid non-L-shape move

### 3.6 Pawn Tests (Section 3.6) ⭐ MOST COMPLEX
**File**: `src/engine/rules/__tests__/meder/pawn.test.ts`

Test cases:
- ✅ T-PAWN-001: Initial two-square move
- ✅ T-PAWN-002: Single-square move after initial
- ✅ T-PAWN-003: Diagonal capture on same level
- ✅ T-PAWN-004: Diagonal capture to different level
- ❌ T-PAWN-005: Invalid forward capture
- ❌ T-PAWN-006: Invalid backward move
- ✅ T-PAWN-007: Promotion on rank 8 (files b,c)
- ✅ T-PAWN-008: Promotion on rank 9 (files z,a,d,e with attack board)
- ✅ T-PAWN-009: Promotion on rank 8 (files z,a,d,e without attack board)
- ✅ T-PAWN-010: En passant capture with level choice
- ❌ T-PAWN-011: En passant invalid after one turn delay
- ❌ T-PAWN-012: Two-square move after being passenger on attack board

### 3.7 Vertical Shadow Tests (Section 2.2) ⭐ CRITICAL
**File**: `src/engine/rules/__tests__/meder/verticalShadow.test.ts`

Test cases:
- ❌ T-SHADOW-001: Rook blocked by pawn on different level
- ❌ T-SHADOW-002: Bishop blocked by piece 2 levels away
- ❌ T-SHADOW-003: Queen blocked through vertical column
- ✅ T-SHADOW-004: Knight ignores vertical shadow
- ❌ T-SHADOW-005: Complex multi-piece shadow scenario

### 3.8 Attack Board Tests (Section 4) ⭐ UNIQUE MECHANIC
**File**: `src/engine/rules/__tests__/meder/attackBoard.test.ts`

Test cases:
- ✅ T-ABOARD-001: Empty board moves to adjacent pin
- ✅ T-ABOARD-002: Occupied board (1 piece) moves forward
- ❌ T-ABOARD-003: Occupied board cannot move backward
- ✅ T-ABOARD-004: Empty board can invert underneath main board
- ❌ T-ABOARD-005: Board with >1 piece cannot move
- ✅ T-ABOARD-006: Temporary control hijack (opponent places piece)
- ❌ T-ABOARD-007: Board cannot move two adjacencies in one turn
- ✅ T-ABOARD-008: Pawn on board loses two-square move privilege

### 3.9 Check/Checkmate/Stalemate Tests (Section 5.3)
**File**: `src/engine/rules/__tests__/meder/gameState.test.ts`

Test cases:
- ✅ T-CHECK-001: King in check from rook
- ✅ T-CHECK-002: King in check from bishop on different level
- ✅ T-CHECK-003: Checkmate with no escape moves
- ✅ T-CHECK-004: Stalemate with no legal moves but not in check
- ✅ T-CHECK-005: Check escape by moving attack board to block
- ✅ T-CHECK-006: Check escape by capturing attacking piece
- ✅ T-CHECK-007: Check escape by moving king

### 3.10 Integration Tests
**File**: `src/engine/rules/__tests__/meder/integration.test.ts`

Full game scenarios:
- Scholar's mate equivalent
- Fool's mate equivalent
- Complex endgame positions
- Attack board tactical sequences

## Phase 4: Test Execution & CI

### 4.1 Run Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:ui        # Visual UI
npm run test:coverage  # Coverage report
```

### 4.2 Coverage Requirements
- Aim for >90% coverage on all rule logic
- 100% coverage on piece movement functions
- 100% coverage on check/checkmate detection

### 4.3 GitHub Actions CI
Create `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run test:coverage
```

## Phase 5: Future Enhancements

### 5.1 Additional Rule Variants
- Classic 2D Chess mode
- Custom variant experiments
- Historical variant implementations

### 5.2 Performance Testing
- Benchmark move generation speed
- Regression detection for algorithm changes

### 5.3 Property-Based Testing
- Use fast-check for generating random valid positions
- Verify invariants hold across all game states

## Implementation Order

1. ✅ Create RuleEngine interface
2. Extract current logic into MederTournamentRules class
3. Set up test utilities (boardSetup, assertions, fixtures)
4. Implement tests in this order (simplest → most complex):
   - Rook (straight lines, vertical shadow)
   - Bishop (diagonals, vertical shadow)
   - Queen (combination)
   - King (basic movement, check detection)
   - Knight (L-shape, shadow immunity)
   - Pawn (all special rules)
   - Attack Boards (unique 3D mechanic)
   - Game state (check/checkmate/stalemate)
   - Integration scenarios
5. Achieve coverage targets
6. Set up CI/CD

## Key Files Summary

```
/src/engine/rules/
├── RuleEngine.interface.ts          ✅ Created
├── MederTournamentRules.ts          → To create
├── __tests__/
│   ├── testUtils/
│   │   ├── boardSetup.ts
│   │   ├── assertions.ts
│   │   └── fixtures.ts
│   └── meder/
│       ├── rook.test.ts
│       ├── bishop.test.ts
│       ├── queen.test.ts
│       ├── king.test.ts
│       ├── knight.test.ts
│       ├── pawn.test.ts
│       ├── verticalShadow.test.ts
│       ├── attackBoard.test.ts
│       ├── gameState.test.ts
│       └── integration.test.ts
```

## Estimated Effort
- Phase 1: 2-3 hours
- Phase 2: 1-2 hours
- Phase 3: 8-12 hours (most time-consuming)
- Phase 4: 1 hour
- **Total**: ~15-20 hours for complete implementation

## Next Steps
1. Create MederTournamentRules class
2. Set up test utilities
3. Begin implementing test files systematically
