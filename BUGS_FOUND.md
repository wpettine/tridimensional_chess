# Bugs Found in Current Implementation

## Critical Bugs

### 1. **Vertical Shadow Blocking Logic Error** ✅ FIXED
**File**: `src/engine/moveValidation.ts` (previously lines 91-94)

**Problem**: The code checked if the DESTINATION square's vertical column is blocked, preventing ALL moves to squares where any piece exists on any level.

**Impact**:
- Pawns could not capture diagonally if enemy piece existed
- All pieces blocked from moving to ANY square that had vertical occupation
- Completely broke captures for sliding pieces

**Fix Applied**:
Removed the incorrect destination check from general validation (lines 91-94). The code now only prevents pure vertical movement (same file/rank, different level) which is correctly forbidden by Meder's Rules Section 2.2.

**Test Results**: All 5 pawn movement tests now pass, including diagonal capture across boards.

### 2. **Test Notation Inconsistency** ✅ FIXED
**File**: `src/engine/rules/__tests__/testUtils/boardSetup.ts`

**Problem**: Notation parser returned 'W', 'N', 'B' but board IDs are 'WL', 'NL', 'BL'

**Status**: Fixed by adding levelMap conversion

## Test Results

### Working ✅
- Pawn forward movement on same board
- Pawn crossing between boards (W → N, B → N)
- Pawn two-square initial move
- Pawn diagonal captures (including across boards)
- Black pawn movement

### Broken ❌
- None currently identified

## Recommended Next Steps

1. **Immediate**: Validate all piece movement with comprehensive tests
   - Test Rook, Bishop, Queen movement and captures
   - Test Knight immunity to vertical shadow
   - Test King movement between boards
   - Add comprehensive vertical shadow blocking tests for sliding pieces

2. **Short-term**: Implement full test suite
   - All 70+ test cases from specification
   - Achieve >90% coverage
   - CI/CD integration

3. **Medium-term**: Extract rule logic into RuleEngine interface
   - Create MederTournamentRules implementation
   - Enable support for multiple rule variants

## How to Test

Run the debug tests:
```bash
npm run test pawnMovement.test.ts
```

Result: ✅ All 5 pawn movement tests pass
