/**
 * Move history display panel
 */

import { useGameStore } from '../../store/gameStore';
import { positionToAlgebraic } from '../../engine/boardUtils';

export function MoveHistory() {
  const moveHistory = useGameStore((state) => state.moveHistory);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Move History</h3>
      <div style={styles.moveList}>
        {moveHistory.length === 0 ? (
          <div style={styles.emptyMessage}>No moves yet</div>
        ) : (
          moveHistory.map((move, idx) => {
            const from = positionToAlgebraic(move.from);
            const to = positionToAlgebraic(move.to);
            const moveNumber = Math.floor(idx / 2) + 1;
            const isWhite = idx % 2 === 0;

            return (
              <div key={idx} style={styles.moveItem}>
                <span style={styles.moveNumber}>
                  {isWhite ? `${moveNumber}.` : ''}
                </span>
                <span style={styles.moveText}>
                  {move.piece.type.charAt(0).toUpperCase()}
                  {move.capturedPiece ? 'x' : ''}
                  {from} → {to}
                  {move.promotionType ? `=${move.promotionType.charAt(0).toUpperCase()}` : ''}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    bottom: '20px',
    right: '20px',
    width: '300px',
    maxHeight: '400px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px',
    padding: '15px',
    zIndex: 1000,
  },
  title: {
    color: 'white',
    marginTop: 0,
    marginBottom: '10px',
    fontSize: '18px',
  },
  moveList: {
    maxHeight: '340px',
    overflowY: 'auto' as const,
    color: 'white',
  },
  emptyMessage: {
    color: '#888',
    fontStyle: 'italic' as const,
  },
  moveItem: {
    padding: '5px 0',
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  moveNumber: {
    display: 'inline-block',
    width: '40px',
    color: '#aaa',
  },
  moveText: {
    color: '#fff',
  },
};
