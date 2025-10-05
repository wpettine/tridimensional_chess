/**
 * Main 3D board component
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { BoardRenderer } from './BoardRenderer';
import { Pieces3D } from './Pieces3D';
import { ValidMoveIndicators } from './ValidMoveIndicators';

export function Board3D() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas shadows>
        {/* Camera positioned to view the overlapping boards */}
        <PerspectiveCamera makeDefault position={[15, -6, 18]} />
        <OrbitControls target={[0, 4, 4]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 20]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* All game boards (main and attack) using unified renderer */}
        <BoardRenderer />

        {/* Pieces */}
        <Pieces3D />

        {/* Valid move indicators */}
        <ValidMoveIndicators />

        {/* Grid helper on XY plane (horizontal) */}
        <gridHelper args={[40, 40]} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]} />
      </Canvas>
    </div>
  );
}
