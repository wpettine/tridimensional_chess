/**
 * 3D Chess pieces visualization
 * Uses coordinate system for accurate positioning
 */

import { useGameStore } from '../../store/gameStore';
import type { Piece, Position } from '../../engine/types';
import { globalToWorld } from '../../engine/coordinateSystem';

function ChessPiece({ piece }: { piece: Piece }) {
  const selectPiece = useGameStore((state) => state.selectPieceAction);
  const deselectPiece = useGameStore((state) => state.deselectPieceAction);
  const selectedPiece = useGameStore((state) => state.selectedPiece);
  const currentTurn = useGameStore((state) => state.currentTurn);

  // Use coordinate system to get world position
  const [x, y, z] = globalToWorld(piece.position);
  const pieceZ = z + 0.5; // Place piece on top of board

  const isSelected = selectedPiece?.id === piece.id;
  const color = piece.color === 'white' ? '#FFFFFF' : '#1a1a1a';

  const handleClick = () => {
    if (piece.color === currentTurn) {
      if (isSelected) {
        deselectPiece();
      } else {
        selectPiece(piece);
      }
    }
  };

  // Simple geometric representations for pieces
  const renderPieceGeometry = () => {
    switch (piece.type) {
      case 'pawn':
        return (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case 'rook':
        return (
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      case 'knight':
        return (
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 0.8, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      case 'bishop':
        return (
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.3, 1, 16]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      case 'queen':
        return (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.5, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case 'king':
        return (
          <group>
            <mesh castShadow>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow position={[0, 0, 0.5]}>
              <boxGeometry args={[0.5, 0.1, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.5, 0.1, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh castShadow position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.4, 0.4, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      default:
        return null;
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
      {renderPieceGeometry()}
      {isSelected && (
        <mesh position={[0, 0, -0.5]} rotation={[0, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
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
