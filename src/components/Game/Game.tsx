/**
 * Main game component that combines all UI elements
 */

import { Board3D } from '../Board3D/Board3D';
import { GameControls } from '../UI/GameControls';
import { GameStatus } from '../UI/GameStatus';
import { MoveHistory } from '../UI/MoveHistory';

export function Game() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <GameStatus />
      <GameControls />
      <MoveHistory />
      <Board3D />
    </div>
  );
}
