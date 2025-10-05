/**
 * Camera controller (runs inside Canvas)
 */

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { BOARD_THEME } from '../../config/theme';

interface CameraControllerProps {
  preset: 'front' | 'side' | 'top' | null;
}

export function CameraController({ preset }: CameraControllerProps) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!preset) return;

    const { position, target } = BOARD_THEME.camera.presets[preset];

    // Set camera position and ensure proper up vector
    camera.position.set(...position);
    camera.up.set(0, 0, 1); // Z-axis is up

    // Update orbit controls target if available
    if (controls && 'target' in controls) {
      (controls as any).target.set(...target);
      (controls as any).update();
    }

    // Force camera to look at target after controls update
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [preset, camera, controls]);

  return null;
}
