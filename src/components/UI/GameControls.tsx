/**
 * Game control buttons and UI
 */

import { useGameStore } from '../../store/gameStore';

export function GameControls() {
  const newGame = useGameStore((state) => state.newGame);
  const undoMove = useGameStore((state) => state.undoMove);
  const saveGame = useGameStore((state) => state.saveGame);
  const loadGame = useGameStore((state) => state.loadGame);
  const moveHistory = useGameStore((state) => state.moveHistory);

  return (
    <div style={styles.container}>
      <div style={styles.buttonGroup}>
        <button onClick={newGame} style={styles.button}>
          New Game
        </button>
        <button
          onClick={undoMove}
          disabled={moveHistory.length === 0}
          style={{
            ...styles.button,
            ...(moveHistory.length === 0 ? styles.buttonDisabled : {}),
          }}
        >
          Undo Move
        </button>
        <button onClick={saveGame} style={styles.button}>
          Save Game
        </button>
        <button onClick={loadGame} style={styles.button}>
          Load Game
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column' as const,
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4a5568',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#718096',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};
