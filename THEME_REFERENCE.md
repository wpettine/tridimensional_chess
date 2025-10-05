# Quick Theme Reference

A quick reference for all customizable theme properties.

## Board Elements

### Squares (Checkerboard Pattern)
```
BOARD_THEME.squares.light      → Light squares (e.g., white squares)
BOARD_THEME.squares.dark       → Dark squares (e.g., brown squares)
BOARD_THEME.squares.opacity    → How transparent the squares are
BOARD_THEME.squares.gap        → Space between squares
```

### Platforms (Base of Each Board Level)
```
BOARD_THEME.platforms.whiteMain    → Bottom board (White's main)
BOARD_THEME.platforms.neutralMain  → Middle board (Neutral zone)
BOARD_THEME.platforms.blackMain    → Top board (Black's main)
BOARD_THEME.platforms.attack       → Attack boards (4 smaller boards)
BOARD_THEME.platforms.opacity      → Platform transparency
BOARD_THEME.platforms.thickness    → How thick the platform is
BOARD_THEME.platforms.gap          → Space around platform edge
```

### Labels (Colored Cubes That Mark Each Board)
```
BOARD_THEME.labels.white    → White board marker
BOARD_THEME.labels.neutral  → Neutral board marker
BOARD_THEME.labels.black    → Black board marker
BOARD_THEME.labels.attack   → Attack board markers
BOARD_THEME.labels.size     → Size of label cubes
```

### Pillars (Support Columns Under Attack Boards)
```
BOARD_THEME.pillars.color   → Pillar color
BOARD_THEME.pillars.radius  → How thick the pillars are
BOARD_THEME.pillars.height  → How tall the pillars are
```

## Piece Elements

### Piece Colors
```
BOARD_THEME.pieces.white.primary    → White piece material (3D models)
BOARD_THEME.pieces.white.fallback   → White piece fallback (simple shapes)
BOARD_THEME.pieces.black.primary    → Black piece material (3D models)
BOARD_THEME.pieces.black.fallback   → Black piece fallback (simple shapes)
BOARD_THEME.pieces.scale            → Size multiplier for all pieces
```

### Selection Indicator (Ring Around Selected Piece)
```
BOARD_THEME.pieces.selection.color             → Ring color
BOARD_THEME.pieces.selection.emissive          → Ring glow color
BOARD_THEME.pieces.selection.emissiveIntensity → How bright the glow is
```

## Move Indicators

### Valid Move Rings
```
BOARD_THEME.moves.valid    → Color for normal move indicators
BOARD_THEME.moves.capture  → Color for capture move indicators
BOARD_THEME.moves.opacity  → How transparent the indicators are
BOARD_THEME.moves.size     → Indicator ring size
```

## Scene Setup

### Lighting
```
BOARD_THEME.lighting.ambient.intensity            → Overall brightness
BOARD_THEME.lighting.directional.position         → Where main light comes from [x,y,z]
BOARD_THEME.lighting.directional.intensity        → Main light strength
BOARD_THEME.lighting.directional.shadowMapSize    → Shadow quality (higher = better)
```

### Camera
```
BOARD_THEME.camera.position  → Where camera starts [x,y,z]
BOARD_THEME.camera.target    → What camera looks at [x,y,z]
```
*Note: Users can still pan/rotate the camera with mouse*

### Grid Helper (Reference Lines on Ground)
```
BOARD_THEME.grid.size       → How large the grid is
BOARD_THEME.grid.divisions  → How many grid lines
BOARD_THEME.grid.position   → Where grid is placed [x,y,z]
BOARD_THEME.grid.rotation   → Grid orientation [x,y,z]
```

## UI Elements

### Colors
```
BOARD_THEME.ui.background          → Main background color
BOARD_THEME.ui.controlBackground   → Control panels background
BOARD_THEME.ui.controlText         → Control panels text color
BOARD_THEME.ui.buttonBackground    → Button default color
BOARD_THEME.ui.buttonHover         → Button hover color
```

### Status Indicators
```
BOARD_THEME.ui.statusBackground.white      → Shows when it's White's turn
BOARD_THEME.ui.statusBackground.black      → Shows when it's Black's turn
BOARD_THEME.ui.statusBackground.check      → Shows when king is in check
BOARD_THEME.ui.statusBackground.checkmate  → Shows when game is over
```

## Common Customizations

### Make Everything Brighter
1. Increase `lighting.ambient.intensity` to 0.8-1.0
2. Increase `lighting.directional.intensity` to 1.5-2.0

### Make Boards More Opaque
1. Set `squares.opacity` to 0.9 or 1.0
2. Set `platforms.opacity` to 0.9 or 1.0

### Bigger Pieces
- Increase `pieces.scale` from 0.8 to 1.0 or higher

### Different Color Scheme
- Change `squares.light` and `squares.dark`
- Change all `platforms.*` colors to match
- Update `labels.*` colors accordingly

### Better Shadows
- Increase `lighting.directional.shadowMapSize` to 4096 or 8192
  (Warning: Higher values impact performance)

## Color Format

All colors use hex format: `#RRGGBB`
- Examples: `#FFFFFF` (white), `#000000` (black), `#FF0000` (red)
- Can also use CSS color names in some cases

## Units

- Positions: World space units [x, y, z]
- Sizes: World space units (approximately 1 unit = 1 meter in scene)
- Opacity: 0.0 (transparent) to 1.0 (opaque)
- Intensity: Typically 0.0 to 2.0 (no strict limit)

## File Location

**Edit this file to change theme:**
```
src/config/theme.ts
```

Changes take effect immediately with hot reload!

