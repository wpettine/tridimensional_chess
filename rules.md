```markdown
# 3D Chess Game Rules & Logic

## 1. Board and Coordinate System

### Game Boards
The game consists of three fixed **4x4** main boards and four movable **2x2** attack boards.

### Main Boards
-   Designated as **White's Board** (lowest), the **Neutral Board** (middle), and **Black's Board** (highest).

### Attack Boards
-   Two start on White's level (**Queen's Level** and **King's Level**).
-   Two start on Black's level, mirroring White's.

### Coordinate System
A three-dimensional system is required to track piece and board positions.
-   **Files (Columns):** Can be designated `z`, `a`, `b`, `c`, `d`, `e`.
-   **Ranks (Rows):** Can be designated `0` through `9` to accommodate the overhang of attack boards.
-   **Levels (Boards):** A vertical coordinate is needed to distinguish between the main boards and attack boards.

### Non-existent Squares
The program must account for coordinates that do not correspond to a physical square at any given time, as the attack boards' positions can vary.

---

## 2. Initial Piece Setup

The initial setup involves 16 pieces per player, identical to standard chess.

### White's Main Board (4x4)
-   **Rank 1 (Back Rank):** Knight, Bishop, Bishop, Knight (from left to right).
-   **Rank 2 (Front Rank):** Four Pawns.
-   **Ranks 3-4:** Empty.

### White's Left Attack Board (Queen Side, 2x2)
-   **Rank 0 (Back Rank):** Rook (left), Queen (right).
-   **Rank 1 (Front Rank):** Two Pawns.

### White's Right Attack Board (King Side, 2x2)
-   **Rank 0 (Back Rank):** King (left), Rook (right).
-   **Rank 1 (Front Rank):** Two Pawns.

### Black's Main Board (4x4)
-   **Ranks 0-1:** Empty.
-   **Rank 7 (Front Rank):** Four Pawns.
-   **Rank 8 (Back Rank):** Knight, Bishop, Bishop, Knight (from left to right).

### Black's Left Attack Board (Queen Side, 2x2)
-   **Rank 8 (Front Rank):** Two Pawns.
-   **Rank 9 (Back Rank):** Rook (left), Queen (right).

### Black's Right Attack Board (King Side, 2x2)
-   **Rank 8 (Front Rank):** Two Pawns.
-   **Rank 9 (Back Rank):** King (left), Rook (right).

**Note:** The "back rank" contains the major pieces (Knights, Bishops, Rooks, Queens, Kings), while the "front rank" contains the Pawns positioned one rank closer to the opponent.

---

## 3. Core Game Logic

### Objective
-   To **checkmate** the opponent's king. A player wins when the opponent's king is under attack and has no legal move to escape.

### Turn Structure
-   White moves first, and players alternate turns.
-   A turn consists of either moving a piece or moving an attack board.

### Game End
-   The game ends in **checkmate**, **stalemate** (a draw if a player has no legal moves but is not in check), or if a position arises where checkmate is impossible.

---

## 4. Piece Movement Logic

All standard 2D chess moves are legal, extended into three dimensions with the following critical constraints:

### General Rule
-   A piece's path must be clear on the 2D plane of its movement. It can then change levels at any valid square along that path.

### Vertical Blocking
-   A piece on any square blocks the entire vertical column for all other pieces (except the **Knight**). An opponent's piece cannot move through this column on any level.

### Prohibited Vertical Moves
-   A piece cannot move from a square on one level to the exact same square on another level without any horizontal displacement.

### Piece-Specific Rules

-   **Queen, Rook, Bishop:** Move as in standard chess along ranks, files, and diagonals. Their paths can cross between boards.
-   **Knight:** Moves in an "L" shape (two squares in one direction, then one perpendicularly). It can jump over any intervening pieces and move between levels as part of its leap.
-   **King:** Moves one square in any direction, including to an adjacent square on a different level.
-   **Pawn:**
    -   **Initial Move:** May advance one or two squares forward on the same file, provided the path is clear. A pawn that has been moved as a passenger on an attack board loses this two-square option.
    -   **Capture:** Captures one square diagonally forward, which can be on a different level.
    -   **Promotion:** When a pawn reaches the "furthest rank," it must be promoted to a **Queen**, **Rook**, **Bishop**, or **Knight**. The furthest rank is dynamic:
        -   For central files (`b`, `c`), it is rank `1` (for Black) or `8` (for White).
        -   For outer files (`a`, `d`), it is rank `0` or `9` if an attack board is present, and `1` or `8` if not.

---

## 5. Attack Board Mechanics

### Movement Condition
-   A player may move an attack board instead of a piece if the board is occupied by no more than one piece (of any color or type).

### Control
-   The player whose piece occupies the board controls its movement for that turn.
-   Empty attack boards are controlled by their original owner.

### Movement Method
-   An attack board moves like a **Rook** along the grid of available pins to any "adjacent" pin. The number of adjacent pins depends on the level (e.g., boards on the middle level have more adjacent pins than those on the top or bottom).

### Directional Constraint
-   Occupied attack boards can only move forward or sideways.
-   Only empty attack boards can be moved backward to an inverted pin position.

---

## 6. Special Moves Logic

### Castling
A move involving the **King** and one **Rook** of the same color on the same rank.

-   **Execution:** On the king's side, the **King** and **Rook** exchange places. On the queen's side, the **King** moves next to the **Rook**, and the **Rook** moves to the square the **King** vacated.
-   **Conditions:** Standard FIDE castling rules apply (neither piece has moved, the path is clear, the **King** is not in check and does not pass through or land on an attacked square). Castling is illegal as a first move.
-   **Advanced Implementation (3D-Chess960):** For randomized starting positions, four castling methods exist: double-move, transposition, king-move-only, and rook-move-only.

### En Passant
A pawn that has advanced two squares from its starting position can be captured by an opponent's pawn as if it had only moved one square. This capture is only legal on the immediately following turn.

-   **3D Application:** The capturing pawn has the option to land on any valid level at the destination square.
```
