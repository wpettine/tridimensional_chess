# Star Trek Tri-Dimensional Chess

A React-based implementation of Star Trek's iconic 3D Chess game with stunning 3D visualization using Three.js.

## Features

### V1 - Local Two-Player Gameplay

- ✅ **3D Board Visualization**: Three main 4×4 boards and four movable 2×2 attack boards
- ✅ **Interactive Controls**: Click-to-select pieces and click-to-move interface
- ✅ **Full 3D Movement Rules**: All standard chess pieces with 3D movement extensions
- ✅ **Special Moves**: En passant, pawn promotion, vertical column blocking
- ✅ **Game State Management**: Move validation, check/checkmate detection
- ✅ **Move History**: Track all moves with algebraic notation
- ✅ **Save/Load Games**: Persist games to localStorage
- ✅ **Camera Controls**: Orbit, zoom, and pan to view the board from any angle

### Architecture Highlights

The project is architected with future multiplayer and AI features in mind:

- **Pure TypeScript Game Engine** (`src/engine/`): Core game logic is completely independent of React/UI
- **Serializable State**: Game state can be easily transmitted over network or used for AI training
- **Modular Components**: Clean separation between game logic, state management, and rendering
- **Zustand State Management**: Lightweight and scalable state solution

## Tech Stack

- **React 18+** with TypeScript
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Three.js** - 3D rendering
- **Zustand** - State management
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### First Run

1. The game loads with pieces in their standard starting positions
2. White moves first
3. Click on a piece to see valid moves (highlighted in green)
4. Click on a highlighted square to move
5. Use mouse to orbit camera, scroll to zoom

## Game Rules

This implementation follows the official Star Trek 3D Chess rules:

### Board Structure
- **3 Main Boards (4×4)**: White's board (bottom), Neutral board (middle), Black's board (top)
- **4 Attack Boards (2×2)**: Two per player, movable platforms

### Piece Movement
- All standard chess moves work in 3D
- Pieces can move between levels at any valid square along their path
- **Vertical Column Blocking**: A piece blocks the entire vertical column for other pieces (except Knights)
- **No Pure Vertical Moves**: Pieces cannot move straight up/down without horizontal displacement

### Special Rules
- **Pawn Promotion**: Dynamic based on file and attack board positions
- **En Passant**: Works across levels
- **Attack Board Movement**: Can be moved instead of a piece when occupied by ≤1 piece

### Coordinate System
- **Files**: z, a, b, c, d, e (0-5)
- **Ranks**: 0-9
- **Levels**: WL (White), NL (Neutral), BL (Black), plus attack board levels

## Project Structure

```
src/
├── engine/              # Pure TypeScript game logic
│   ├── types.ts        # Type definitions
│   ├── constants.ts    # Game constants
│   ├── boardUtils.ts   # Board utility functions
│   ├── initialSetup.ts # Starting positions
│   ├── moveValidation.ts # Move validation logic
│   └── gameEngine.ts   # Core game state management
├── store/
│   └── gameStore.ts    # Zustand store
├── components/
│   ├── Game/           # Main game component
│   ├── Board3D/        # 3D rendering components
│   │   ├── Board3D.tsx
│   │   ├── MainBoards.tsx
│   │   ├── AttackBoards.tsx
│   │   ├── Pieces3D.tsx
│   │   └── ValidMoveIndicators.tsx
│   └── UI/             # UI components
│       ├── GameControls.tsx
│       ├── GameStatus.tsx
│       └── MoveHistory.tsx
└── App.tsx
```

## Controls

### Mouse
- **Left Click + Drag**: Rotate camera
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

### Game Controls
- **New Game**: Start a fresh game
- **Undo Move**: Revert last move
- **Save Game**: Save to localStorage
- **Load Game**: Restore saved game

## Future Roadmap

### V2 - Multiplayer
- WebSocket-based online play
- User authentication
- Matchmaking system
- Spectator mode

### V3 - AI Opponent
- AI engine integration
- Multiple difficulty levels
- Analysis mode

### V4 - Advanced Features
- 3D-Chess960 (randomized starting positions)
- Time controls
- Tournament mode
- Replay analysis

## Development

### Key Files

- `src/engine/gameEngine.ts` - Core game logic, move execution
- `src/engine/moveValidation.ts` - Move validation for all piece types
- `src/store/gameStore.ts` - State management with Zustand
- `src/components/Board3D/Pieces3D.tsx` - 3D piece rendering and interaction

### Adding New Features

The architecture supports easy extension:

1. **Game Logic**: Modify `src/engine/` files - they're React-independent
2. **State Management**: Extend `gameStore.ts` with new actions
3. **UI**: Add new components in `src/components/`
4. **3D Rendering**: Extend Board3D components

### Serialization

Game state can be serialized for storage or network transmission:

```typescript
import { serializeGameState, deserializeGameState } from './engine/gameEngine';

const serialized = serializeGameState(gameState);
// Send over network or save to file
const restored = deserializeGameState(serialized);
```

## Known Limitations (V1)

- Attack board movement not yet implemented (coming in V1.1)
- Castling not yet implemented
- No move time tracking
- Piece models are simple geometric shapes (can be upgraded with custom 3D models)

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

MIT

## Acknowledgments

- Star Trek 3D Chess rules based on official tournament specifications
- Built with modern React and Three.js ecosystem

---

**Live long and prosper!** 🖖
