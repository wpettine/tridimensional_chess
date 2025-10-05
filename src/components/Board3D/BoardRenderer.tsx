/**
 * Unified Board Renderer - Renders all boards using coordinate system
 */

import { BOARD_DEFINITIONS, type BoardDefinition } from '../../engine/coordinateSystem';
import { LEVEL_IDS } from '../../engine/constants';
import { BOARD_THEME } from '../../config/theme';

const SQUARE_SIZE = 2;

interface SingleBoardProps {
  definition: BoardDefinition;
}

function SingleBoard({ definition }: SingleBoardProps) {
  const { worldPosition, size, id, type } = definition;

  // Board colors
  const getPlatformColor = () => {
    if (type === 'attack') return BOARD_THEME.platforms.attack;
    switch (id) {
      case LEVEL_IDS.WHITE_MAIN:
        return BOARD_THEME.platforms.whiteMain;
      case LEVEL_IDS.NEUTRAL_MAIN:
        return BOARD_THEME.platforms.neutralMain;
      case LEVEL_IDS.BLACK_MAIN:
        return BOARD_THEME.platforms.blackMain;
      default:
        return '#888888';
    }
  };

  const getLabelColor = () => {
    switch (id) {
      case LEVEL_IDS.WHITE_MAIN:
        return BOARD_THEME.labels.white;
      case LEVEL_IDS.NEUTRAL_MAIN:
        return BOARD_THEME.labels.neutral;
      case LEVEL_IDS.BLACK_MAIN:
        return BOARD_THEME.labels.black;
      default:
        return BOARD_THEME.labels.attack;
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
        <boxGeometry args={[boardWidth - BOARD_THEME.platforms.gap, boardHeight - BOARD_THEME.platforms.gap, BOARD_THEME.platforms.thickness]} />
        <meshStandardMaterial
          color={getPlatformColor()}
          opacity={BOARD_THEME.platforms.opacity}
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
              <boxGeometry args={[SQUARE_SIZE - BOARD_THEME.squares.gap, SQUARE_SIZE - BOARD_THEME.squares.gap, 0.1]} />
              <meshStandardMaterial
                color={isLight ? BOARD_THEME.squares.light : BOARD_THEME.squares.dark}
                opacity={BOARD_THEME.squares.opacity}
                transparent
              />
            </mesh>
          );
        })
      )}

      {/* Support pillars for attack boards */}
      {type === 'attack' && (
        <mesh
          position={[boardCenterX, boardCenterY, boardCenterZ - BOARD_THEME.spacing.attackBoardZOffset / 2]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[BOARD_THEME.pillars.radius, BOARD_THEME.pillars.radius, BOARD_THEME.spacing.attackBoardZOffset]} />
          <meshStandardMaterial color={BOARD_THEME.pillars.color} />
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
