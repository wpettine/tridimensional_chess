# Architecture Overview

## Design Principles

This application is architected with **separation of concerns** and **future extensibility** as core principles:

1. **Pure Game Logic**: The game engine is completely independent of React/UI
2. **Serializable State**: All game state can be transmitted over network or saved
3. **Type Safety**: Full TypeScript coverage for reliability
4. **Modular Components**: Easy to extend and modify

## Layer Architecture

```
┌─────────────────────────────────────┐
│        UI Components (React)        │
│  - Board3D visualization            │
│  - Game controls                    │
│  - Move history                     │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      State Management (Zustand)     │
│  - Game state store                 │
│  - Action dispatchers               │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Game Engine (Pure TypeScript)     │
│  - Move validation                  │
│  - State updates                    │
│  - Check/checkmate detection        │
└─────────────────────────────────────┘
```

## Core Modules

### 1. Game Engine (`src/engine/`)

**Purpose**: Pure TypeScript game logic, no UI dependencies

#### `types.ts`
- Core type definitions
- Position, Piece, Board, GameState interfaces
- Designed for serialization (network transmission, storage)

#### `constants.ts`
- Game configuration
- Board layouts, movement vectors
- Immutable game rules

#### `boardUtils.ts`
- Position validation
- Board state queries
- Coordinate transformations

#### `moveValidation.ts`
- Piece-specific movement rules
- Path checking
- Attack detection
- Check/checkmate logic

#### `gameEngine.ts`
- State transitions
- Move execution
- Game lifecycle management
- Serialization/deserialization

#### `initialSetup.ts`
- Starting positions
- Board configuration

### 2. State Management (`src/store/`)

**Purpose**: Connect UI with game engine

#### `gameStore.ts` (Zustand)
- Manages global game state
- Exposes actions to UI
- Handles persistence (localStorage)
- **Why Zustand?**: Lightweight, easy to integrate with multiplayer later

### 3. UI Layer (`src/components/`)

#### `Board3D/` - 3D Rendering
- **Board3D.tsx**: Main canvas setup
- **MainBoards.tsx**: 4×4 main boards
- **AttackBoards.tsx**: 2×2 movable platforms
- **Pieces3D.tsx**: Chess pieces with interaction
- **ValidMoveIndicators.tsx**: Visual move hints

#### `UI/` - Interface Components
- **GameControls.tsx**: New game, undo, save/load
- **GameStatus.tsx**: Turn indicator, check/checkmate alerts
- **MoveHistory.tsx**: Move log

#### `Game/` - Composition
- **Game.tsx**: Combines all elements

## Data Flow

### Move Execution Flow

```
1. User clicks piece
   └→ UI calls gameStore.selectPieceAction()
      └→ Store calls gameEngine.selectPiece()
         └→ Engine validates piece ownership
         └→ Engine calculates valid moves
         └→ Returns updated state with validMoves[]

2. User clicks destination
   └→ UI calls gameStore.movePiece()
      └→ Store calls gameEngine.executeMove()
         └→ Engine validates move
         └→ Engine updates piece positions
         └→ Engine checks for check/checkmate
         └→ Returns new game state

3. State updates trigger re-render
   └→ React components subscribe to store
   └→ 3D scene updates automatically
```

### State Shape

```typescript
GameState {
  pieces: Piece[]           // All pieces on board
  boards: Board[]           // Board configurations
  currentTurn: Color        // 'white' | 'black'
  moveHistory: Move[]       // Complete game history
  selectedPiece?: Piece     // Currently selected
  validMoves: Position[]    // Where selected piece can move
  check?: Color             // Which king is in check
  checkmate?: Color         // Winner if checkmate
  stalemate: boolean        // Draw condition
  enPassantTarget?: Position // En passant availability
}
```

## Key Design Decisions

### 1. Pure Engine Separation

**Decision**: Game engine is pure TypeScript, no React dependencies

**Rationale**:
- Can be used in Node.js for server-side validation
- Easy to unit test
- Can be ported to other platforms
- AI can use same logic

### 2. Position-Based State

**Decision**: Store piece positions, not board squares

**Rationale**:
- More efficient for sparse 3D space
- Easier to serialize
- Natural for piece-centric game logic

### 3. Validation at Move Time

**Decision**: Validate moves when attempted, not pre-computed

**Rationale**:
- Only compute when needed
- Always accurate (no stale pre-computed data)
- Easier to debug
- Pre-computation can be added as optimization later

### 4. Immutable State Updates

**Decision**: Create new state objects on each change

**Rationale**:
- React rendering works correctly
- Time-travel debugging possible
- Undo/redo is straightforward
- Network sync is easier

## Future Extension Points

### Multiplayer (V2)

**Already prepared:**
- Serializable state (`SerializableGameState` type)
- Pure validation logic (can run on server)
- Move history (for sync)

**To add:**
- WebSocket connection layer
- Server-side validation
- Optimistic updates
- Conflict resolution

### AI Opponent (V3)

**Already prepared:**
- `getValidMoves()` API for move generation
- Pure state transitions
- Position evaluation hooks ready

**To add:**
- Minimax/alpha-beta pruning
- Position evaluation function
- Opening book
- Difficulty levels

### Attack Board Movement (V1.1)

**Already prepared:**
- Board position types
- `canMoveAttackBoard()` in boardUtils
- `AttackBoardMove` type

**To add:**
- UI for attack board selection
- Move validation integration
- Visual indicators for valid positions

## Performance Considerations

### Current Optimizations
- Zustand for minimal re-renders
- Memoization opportunities in components
- Efficient position lookups

### Future Optimizations
- Pre-compute valid moves for current turn
- Web Workers for move validation
- Instanced rendering for pieces
- Level-of-detail for camera distance

## Testing Strategy

### Unit Tests (To Add)
- `moveValidation.ts`: Test each piece type
- `gameEngine.ts`: Test state transitions
- `boardUtils.ts`: Test position calculations

### Integration Tests (To Add)
- Full game scenarios
- Check/checkmate detection
- Special moves (en passant, castling)

### E2E Tests (To Add)
- Complete games
- UI interaction flows

## File Dependencies

```
App.tsx
  └─ Game.tsx
      ├─ Board3D.tsx
      │   ├─ MainBoards.tsx → gameStore
      │   ├─ AttackBoards.tsx → gameStore
      │   ├─ Pieces3D.tsx → gameStore → gameEngine
      │   └─ ValidMoveIndicators.tsx → gameStore
      ├─ GameControls.tsx → gameStore
      ├─ GameStatus.tsx → gameStore
      └─ MoveHistory.tsx → gameStore

gameStore.ts
  └─ gameEngine.ts
      ├─ moveValidation.ts
      │   └─ boardUtils.ts
      ├─ boardUtils.ts
      └─ initialSetup.ts
          └─ constants.ts
```

## Coordinate System

### 3D Space Mapping

```
Files:  z(0)  a(1)  b(2)  c(3)  d(4)  e(5)
Ranks:  0 --- 1 --- 2 --- 3 --- 4 --- 5 --- 6 --- 7 --- 8 --- 9

Levels:
  BL  (Black Main)     - y: 8
  BQL/BKL (Attack)     - y: 10
  NL  (Neutral Main)   - y: 4
  WL  (White Main)     - y: 0
  WQL/WKL (Attack)     - y: 2
```

### World Coordinates

```typescript
function positionToWorld(position: Position): [x, y, z] {
  const x = (position.file - 2.5) * 2  // Center on main board
  const y = getLevelHeight(position.level)
  const z = (position.rank - 4.5) * 2
}
```

## Contributing Guidelines

When adding features:

1. **Start with types** in `engine/types.ts`
2. **Add logic** in appropriate `engine/` file
3. **Expose via store** if UI needs it
4. **Update UI components** last
5. **Update this doc** with design decisions

When fixing bugs:

1. **Check engine first** - logic bugs are usually here
2. **Then check store** - state bugs
3. **Finally UI** - rendering bugs

## Questions & Answers

**Q: Why not Redux?**
A: Zustand is lighter, easier for future multiplayer, and sufficient for this app's complexity.

**Q: Why Three.js not Babylon.js?**
A: React Three Fiber has better React integration and community support.

**Q: Why not use a chess library?**
A: 3D chess is too unique; standard libraries won't work.

**Q: Why Vite not Create React App?**
A: Faster builds, better dev experience, more modern.
