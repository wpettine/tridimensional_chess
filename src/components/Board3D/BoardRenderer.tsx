/**
 * Unified Board Renderer - Renders all boards using coordinate system
 */

import { BOARD_DEFINITIONS, type BoardDefinition } from '../../engine/coordinateSystem';
import { LEVEL_IDS } from '../../engine/constants';

const SQUARE_SIZE = 2;

interface SingleBoardProps {
  definition: BoardDefinition;
}

function SingleBoard({ definition }: SingleBoardProps) {
  const { worldPosition, size, id, type } = definition;

  // Board colors
  const getPlatformColor = () => {
    if (type === 'attack') return '#D4AF37'; // Gold for attack boards
    switch (id) {
      case LEVEL_IDS.WHITE_MAIN:
        return '#8B7355';
      case LEVEL_IDS.NEUTRAL_MAIN:
        return '#A0826D';
      case LEVEL_IDS.BLACK_MAIN:
        return '#6F5645';
      default:
        return '#888888';
    }
  };

  const getLabelColor = () => {
    switch (id) {
      case LEVEL_IDS.WHITE_MAIN:
        return '#ffffff';
      case LEVEL_IDS.NEUTRAL_MAIN:
        return '#888888';
      case LEVEL_IDS.BLACK_MAIN:
        return '#000000';
      default:
        return '#D4AF37'; // Gold for attack boards
    }
  };

  // Calculate board center from bottom-left corner
  const boardCenterX = worldPosition.x + (size.width * SQUARE_SIZE) / 2;
  const boardCenterY = worldPosition.y + (size.height * SQUARE_SIZE) / 2;
  const boardCenterZ = worldPosition.z;

  const boardWidth = size.width * SQUARE_SIZE;
  const boardHeight = size.height * SQUARE_SIZE;

  return (
    <group>
      {/* Board platform */}
      <mesh
        castShadow
        receiveShadow
        position={[boardCenterX, boardCenterY, boardCenterZ - 0.15]}
      >
        <boxGeometry args={[boardWidth - 0.2, boardHeight - 0.2, 0.2]} />
        <meshStandardMaterial
          color={getPlatformColor()}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* Board squares */}
      {Array.from({ length: size.height }).map((_, y) =>
        Array.from({ length: size.width }).map((_, x) => {
          // Calculate square position (centered in the square)
          const squareX = worldPosition.x + (x + 0.5) * SQUARE_SIZE;
          const squareY = worldPosition.y + (y + 0.5) * SQUARE_SIZE;
          const isLight = (x + y) % 2 === 0;

          return (
            <mesh
              key={`${x}-${y}`}
              position={[squareX, squareY, boardCenterZ]}
              receiveShadow
            >
              <boxGeometry args={[SQUARE_SIZE - 0.1, SQUARE_SIZE - 0.1, 0.1]} />
              <meshStandardMaterial
                color={isLight ? '#F0D9B5' : '#B58863'}
                opacity={0.75}
                transparent
              />
            </mesh>
          );
        })
      )}

      {/* Level label */}
      <mesh position={[boardCenterX + boardWidth / 2 + 1, boardCenterY, boardCenterZ]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={getLabelColor()} />
      </mesh>

      {/* Support pillars for attack boards */}
      {type === 'attack' && (
        <mesh
          position={[boardCenterX, boardCenterY, boardCenterZ - 1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.1, 0.1, 2]} />
          <meshStandardMaterial color="#C0C0C0" />
        </mesh>
      )}
    </group>
  );
}

/**
 * Renders all boards using the coordinate system definitions
 */
export function BoardRenderer() {
  const boardIds = Object.keys(BOARD_DEFINITIONS);

  return (
    <group>
      {boardIds.map((boardId) => (
        <SingleBoard key={boardId} definition={BOARD_DEFINITIONS[boardId]} />
      ))}
    </group>
  );
}
