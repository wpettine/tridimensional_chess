/**
 * Camera view preset controls (HTML UI)
 */

import { BOARD_THEME } from '../../config/theme';

interface CameraControlsProps {
  onViewChange: (preset: 'front' | 'side' | 'top') => void;
}

export function CameraControls({ onViewChange }: CameraControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => onViewChange('front')}
        style={{
          padding: '10px 20px',
          backgroundColor: BOARD_THEME.ui.buttonBackground,
          color: BOARD_THEME.ui.controlText,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonBackground;
        }}
      >
        Front View
      </button>
      <button
        onClick={() => onViewChange('side')}
        style={{
          padding: '10px 20px',
          backgroundColor: BOARD_THEME.ui.buttonBackground,
          color: BOARD_THEME.ui.controlText,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonBackground;
        }}
      >
        Side View
      </button>
      <button
        onClick={() => onViewChange('top')}
        style={{
          padding: '10px 20px',
          backgroundColor: BOARD_THEME.ui.buttonBackground,
          color: BOARD_THEME.ui.controlText,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = BOARD_THEME.ui.buttonBackground;
        }}
      >
        Top View
      </button>
    </div>
  );
}
