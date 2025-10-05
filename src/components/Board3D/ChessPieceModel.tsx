/**
 * 3D Chess Piece Model Component
 * Loads GLTF models and applies color materials
 */

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Color } from 'three';
import type { PieceType, Color as PieceColor } from '../../engine/types';
import { Suspense, Component, ReactNode } from 'react';
import { BOARD_THEME } from '../../config/theme';

interface ChessPieceModelProps {
  type: PieceType;
  color: PieceColor;
  scale?: number;
  position?: [number, number, number];
}

/**
 * Fallback geometry while model loads
 */
function FallbackPiece({ type, color }: { type: PieceType; color: PieceColor }) {
  const pieceColor = color === 'white' ? BOARD_THEME.pieces.white.fallback : BOARD_THEME.pieces.black.fallback;

  switch (type) {
    case 'pawn':
      return (
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
    case 'rook':
      return (
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.5, 0.8]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
    case 'knight':
      return (
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.4, 0.8, 4]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
    case 'bishop':
      return (
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 1, 16]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
    case 'queen':
      return (
        <mesh castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
    case 'king':
      return (
        <mesh castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={pieceColor} />
        </mesh>
      );
  }
}

/**
 * Error boundary for model loading failures
 */
class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Model loading failed:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Loaded GLTF model with applied materials
 */
function LoadedModel({ type, color, scale = 1 }: ChessPieceModelProps) {
  const modelPath = `/models/chess/${BOARD_THEME.pieces.modelSet}/${type}.${BOARD_THEME.pieces.modelFormat}`;
  const gltf = useLoader(GLTFLoader, modelPath);

  // Material colors
  const materialColor = new Color(color === 'white' ? BOARD_THEME.pieces.white.primary : BOARD_THEME.pieces.black.primary);

  // Clone the scene to avoid modifying the cached model
  const scene = gltf.scene.clone();

  // Apply material to all meshes
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = child.material.clone();
      child.material.color = materialColor;
      child.material.metalness = 0.3;
      child.material.roughness = 0.7;
    }
  });

  // Apply rotation if configured
  const rotation = BOARD_THEME.pieces.rotation || [0, 0, 0];

  return <primitive object={scene} scale={scale} rotation={rotation} />;
}

/**
 * Chess piece with suspense and error boundary
 */
export function ChessPieceModel({ type, color, scale = 0.5, position = [0, 0, 0] }: ChessPieceModelProps) {
  const fallback = <FallbackPiece type={type} color={color} />;

  return (
    <group position={position}>
      <ModelErrorBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <LoadedModel type={type} color={color} scale={scale} />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}
