/**
 * Game status display (turn, check, checkmate)
 */

import { useGameStore } from '../../store/gameStore';

export function GameStatus() {
  const currentTurn = useGameStore((state) => state.currentTurn);
  const check = useGameStore((state) => state.check);
  const checkmate = useGameStore((state) => state.checkmate);
  const stalemate = useGameStore((state) => state.stalemate);

  const getStatusMessage = () => {
    if (checkmate) {
      const winner = checkmate === 'white' ? 'White' : 'Black';
      return `Checkmate! ${winner} wins!`;
    }
    if (stalemate) {
      return 'Stalemate! Game is a draw.';
    }
    if (check) {
      return `${check === 'white' ? 'White' : 'Black'} is in check!`;
    }
    return `${currentTurn === 'white' ? 'White' : 'Black'}'s turn`;
  };

  const getStatusColor = () => {
    if (checkmate) return '#ff4444';
    if (stalemate) return '#888888';
    if (check) return '#ff8800';
    return currentTurn === 'white' ? '#ffffff' : '#1a1a1a';
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.status, backgroundColor: getStatusColor() }}>
        <span style={styles.text}>{getStatusMessage()}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    zIndex: 1000,
  },
  status: {
    padding: '15px 25px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  text: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  },
};
