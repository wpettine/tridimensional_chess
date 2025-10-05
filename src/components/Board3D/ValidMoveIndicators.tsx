/**
 * Visual indicators for valid moves
 * Uses coordinate system for accurate positioning
 */

import { useGameStore } from '../../store/gameStore';
import type { Position } from '../../engine/types';
import { globalToWorld } from '../../engine/coordinateSystem';
import { getPieceAtPosition } from '../../engine/boardUtils';
import { BOARD_THEME } from '../../config/theme';

function ValidMoveIndicator({ position }: { position: Position }) {
  const movePiece = useGameStore((state) => state.movePiece);
  const selectedPiece = useGameStore((state) => state.selectedPiece);
  const pieces = useGameStore((state) => state.pieces);

  // Use coordinate system to get world position
  const [x, y, z] = globalToWorld(position);
  const indicatorZ = z + 0.05; // Slightly above board

  const isCapture = !!getPieceAtPosition(position, pieces);

  const handleClick = () => {
    if (selectedPiece) {
      movePiece(selectedPiece, position);
    }
  };

  return (
    <mesh
      position={[x, y, indicatorZ]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
      rotation={[0, 0, 0]}
    >
      <ringGeometry args={[0.5, 0.7, 32]} />
      <meshStandardMaterial
        color={isCapture ? BOARD_THEME.moves.capture : BOARD_THEME.moves.valid}
        transparent
        opacity={BOARD_THEME.moves.opacity}
        emissive={isCapture ? BOARD_THEME.moves.capture : BOARD_THEME.moves.valid}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function ValidMoveIndicators() {
  const validMoves = useGameStore((state) => state.validMoves);

  return (
    <group>
      {validMoves.map((move, idx) => (
        <ValidMoveIndicator key={`${move.file}-${move.rank}-${move.level}-${idx}`} position={move} />
      ))}
    </group>
  );
}
