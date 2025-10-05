/**
 * Main game component that combines all UI elements
 */

import { Board3D } from '../Board3D/Board3D';
import { GameControls } from '../UI/GameControls';
import { GameStatus } from '../UI/GameStatus';
import { MoveHistory } from '../UI/MoveHistory';
import { BOARD_THEME } from '../../config/theme';

export function Game() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: `radial-gradient(circle at center, ${BOARD_THEME.ui.background}, ${BOARD_THEME.ui.backgroundEdge || '#1E1E1E'})`
    }}>
      <GameStatus />
      <GameControls />
      <MoveHistory />
      <Board3D />
    </div>
  );
}
