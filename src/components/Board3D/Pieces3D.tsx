/**
 * 3D Chess pieces visualization
 * Uses 3D models with fallback to primitive shapes
 */

import { useGameStore } from '../../store/gameStore';
import type { Piece } from '../../engine/types';
import { globalToWorld } from '../../engine/coordinateSystem';
import { ChessPieceModel } from './ChessPieceModel';
import { BOARD_THEME } from '../../config/theme';

function ChessPiece({ piece }: { piece: Piece }) {
  const selectPiece = useGameStore((state) => state.selectPieceAction);
  const deselectPiece = useGameStore((state) => state.deselectPieceAction);
  const selectedPiece = useGameStore((state) => state.selectedPiece);
  const currentTurn = useGameStore((state) => state.currentTurn);

  // Use coordinate system to get world position
  const [x, y, z] = globalToWorld(piece.position);
  const pieceZ = z + 0.05; // Place piece on top of board

  const isSelected = selectedPiece?.id === piece.id;

  const handleClick = () => {
    if (piece.color === currentTurn) {
      if (isSelected) {
        deselectPiece();
      } else {
        selectPiece(piece);
      }
    }
  };

  return (
    <group
      position={[x, y, pieceZ]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (piece.color === currentTurn) {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* 3D Model with automatic fallback to primitives */}
      <ChessPieceModel type={piece.type} color={piece.color} scale={BOARD_THEME.pieces.scale} />

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial 
            color={BOARD_THEME.pieces.selection.color} 
            emissive={BOARD_THEME.pieces.selection.emissive} 
            emissiveIntensity={BOARD_THEME.pieces.selection.emissiveIntensity} 
          />
        </mesh>
      )}
    </group>
  );
}

export function Pieces3D() {
  const pieces = useGameStore((state) => state.pieces);

  return (
    <group>
      {pieces.map((piece) => (
        <ChessPiece key={piece.id} piece={piece} />
      ))}
    </group>
  );
}
