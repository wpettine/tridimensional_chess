/**
 * Main 3D board component
 */

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { BoardRenderer } from './BoardRenderer';
import { Pieces3D } from './Pieces3D';
import { ValidMoveIndicators } from './ValidMoveIndicators';
import { CameraController } from './CameraController';
import { CameraControls } from '../UI/CameraControls';
import { BOARD_THEME } from '../../config/theme';

export function Board3D() {
  const [cameraPreset, setCameraPreset] = useState<'front' | 'side' | 'top' | null>(null);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ up: [0, 0, 1] }}>
        {/* Camera positioned to view the overlapping boards */}
        <PerspectiveCamera makeDefault position={BOARD_THEME.camera.position} up={[0, 0, 1]} />
        <OrbitControls target={BOARD_THEME.camera.target} />

        {/* Camera controller for preset views */}
        <CameraController preset={cameraPreset} />

        {/* Lighting */}
        <ambientLight intensity={BOARD_THEME.lighting.ambient.intensity} />
        <directionalLight
          position={BOARD_THEME.lighting.directional.position}
          intensity={BOARD_THEME.lighting.directional.intensity}
          castShadow
          shadow-mapSize-width={BOARD_THEME.lighting.directional.shadowMapSize}
          shadow-mapSize-height={BOARD_THEME.lighting.directional.shadowMapSize}
        />

        {/* All game boards (main and attack) using unified renderer */}
        <BoardRenderer />

        {/* Pieces */}
        <Pieces3D />

        {/* Valid move indicators */}
        <ValidMoveIndicators />

        {/* Grid helper on XY plane (horizontal) */}
        <gridHelper args={[BOARD_THEME.grid.size, BOARD_THEME.grid.divisions]} position={BOARD_THEME.grid.position} rotation={BOARD_THEME.grid.rotation} />
      </Canvas>

      {/* Camera view controls (outside Canvas for HTML rendering) */}
      <CameraControls onViewChange={setCameraPreset} />
    </div>
  );
}
