# Quick Start Guide

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

## How to Play

### 1. Starting a Game
- The game loads with pieces in standard 3D chess positions
- White always moves first

### 2. Basic Controls

#### Camera Navigation
- **Rotate**: Click and drag with left mouse button
- **Pan**: Click and drag with right mouse button
- **Zoom**: Use scroll wheel

#### Making Moves
1. Click on a piece (of your color) to select it
2. Valid moves will be highlighted:
   - **Green rings**: Normal moves
   - **Red rings**: Captures
3. Click on a highlighted square to move
4. Click the piece again to deselect

### 3. Game Controls

Located in the top-right corner:
- **New Game**: Reset the board
- **Undo Move**: Take back the last move
- **Save Game**: Save to browser storage
- **Load Game**: Restore saved game

### 4. Game Information

**Top-left**: Shows current turn and game status
- Turn indicator
- Check warnings
- Checkmate/stalemate announcements

**Bottom-right**: Move history
- Shows all moves in algebraic notation
- Format: `PieceType from → to`

## Understanding the Board

### Board Levels (Bottom to Top)
1. **White's Main Board** (Brown) - Files a-d, Ranks 2-5
2. **White's Attack Boards** (Gold) - 2×2 platforms
3. **Neutral Board** (Medium Brown) - Files a-d, Ranks 4-7
4. **Black's Main Board** (Dark Brown) - Files a-d, Ranks 6-9
5. **Black's Attack Boards** (Gold) - 2×2 platforms

### Visual Indicators
- **White pieces**: Light colored
- **Black pieces**: Dark colored
- **Selected piece**: Gold highlight ring
- **Valid moves**: Green or red rings
- **Board squares**: Alternating light/dark pattern

## Movement Rules Quick Reference

### Standard Pieces in 3D
- **Pawn**: Forward 1-2 squares (first move), diagonal capture, can move between levels
- **Knight**: L-shape (2+1), can jump between levels
- **Bishop**: Diagonals, can change levels at any diagonal square
- **Rook**: Straight lines, can change levels along path
- **Queen**: Combines rook + bishop movement
- **King**: One square any direction, including to adjacent levels

### 3D-Specific Rules
1. **Vertical Column Blocking**: A piece blocks its (file, rank) column on ALL levels
2. **No Pure Vertical Moves**: Must move horizontally to change levels
3. **Knights Ignore Blocking**: Can jump over any piece and between levels

### Special Moves
- **En Passant**: Works across levels
- **Pawn Promotion**: When reaching furthest rank (varies by file)
- **Castling**: Not yet implemented (coming soon)

## Tips for New Players

### Camera Management
1. Start by rotating to get familiar with 3D layout
2. Zoom in to see piece details
3. Pan to focus on different board sections
4. Reset view by refreshing page if lost

### Strategy
1. Control the center (Neutral board)
2. Watch for vertical column blocks
3. Knights are powerful - they ignore blocking
4. Attack boards create unique tactical opportunities

### Common Mistakes
1. ❌ Forgetting vertical blocking rules
2. ❌ Trying to move straight up/down
3. ❌ Not checking all levels for threats
4. ❌ Ignoring attack board positions

## Keyboard Shortcuts

Currently none - coming in future versions!

## Troubleshooting

### Game won't load
- Ensure you have Node.js 18+ installed
- Run `npm install` again
- Clear browser cache

### Can't see the board
- Make sure WebGL is enabled in your browser
- Try a different browser (Chrome, Firefox recommended)
- Check browser console for errors

### Pieces won't move
- Make sure it's your turn
- Check if the move is legal (watch for checks)
- Try deselecting and reselecting the piece

### Performance issues
- Close other browser tabs
- Reduce browser zoom level to 100%
- Try disabling browser extensions

## Game Save Format

Games are saved to browser's localStorage as JSON:
- Key: `tri_dim_chess_save`
- Contains: Full game state, move history
- Persists: Until browser data cleared

## Next Steps

1. **Play a full game** to learn the mechanics
2. **Experiment** with 3D tactics
3. **Read** `ARCHITECTURE.md` to understand the code
4. **Contribute** features or report bugs

## Resources

- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical design
- `rules.md` - Complete game rules

---

**Enjoy your 3D chess experience!** 🖖
