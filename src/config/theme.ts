/**
 * Central theme configuration for the 3D chess board
 * All visual styling constants are defined here for easy customization
 */

/**
 * Theme structure definition
 */
interface BoardTheme {
  squares: {
    light: string;
    dark: string;
    opacity: number;
    gap: number;
  };
  platforms: {
    whiteMain: string;
    neutralMain: string;
    blackMain: string;
    attack: string;
    opacity: number;
    thickness: number;
    gap: number;
  };
  labels: {
    white: string;
    neutral: string;
    black: string;
    attack: string;
    size: number;
  };
  pillars: {
    color: string;
    radius: number;
  };
  pieces: {
    modelSet: string;
    modelFormat: string;
    white: {
      primary: string;
      fallback: string;
      accent?: string;
    };
    black: {
      primary: string;
      fallback: string;
      accent?: string;
    };
    selection: {
      color: string;
      emissive: string;
      emissiveIntensity: number;
    };
    scale: number;
    rotation: [number, number, number];
  };
  moves: {
    valid: string;
    capture: string;
    opacity: number;
    size: number;
  };
  spacing: {
    mainBoardZSpacing: number;
    attackBoardZOffset: number;
  };
  lighting: {
    ambient: {
      intensity: number;
    };
    directional: {
      position: [number, number, number];
      intensity: number;
      shadowMapSize: number;
    };
  };
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    presets: {
      front: { position: [number, number, number]; target: [number, number, number] };
      side: { position: [number, number, number]; target: [number, number, number] };
      top: { position: [number, number, number]; target: [number, number, number] };
    };
  };
  grid: {
    size: number;
    divisions: number;
    position: [number, number, number];
    rotation: [number, number, number];
  };
  ui: {
    background: string;
    backgroundEdge?: string;
    controlBackground: string;
    controlText: string;
    buttonBackground: string;
    buttonHover: string;
    statusBackground: {
      white: string;
      black: string;
      check: string;
      checkmate: string;
    };
  };
}

/**
 * Classic wooden theme (original)
 */
const CLASSIC_THEME: BoardTheme = {
  squares: {
    light: '#F0D9B5',
    dark: '#B58863',
    opacity: 0.75,
    gap: 0.1,
  },
  platforms: {
    whiteMain: '#8B7355',
    neutralMain: '#A0826D',
    blackMain: '#6F5645',
    attack: '#D4AF37', // Gold
    opacity: 0.7,
    thickness: 0.2,
    gap: 0.2,
  },
  labels: {
    white: '#ffffff',
    neutral: '#888888',
    black: '#000000',
    attack: '#D4AF37', // Gold
    size: 0.5,
  },
  pillars: {
    color: '#C0C0C0',
    radius: 0.1,
  },
  pieces: {
    modelSet: 'basic',
    modelFormat: 'gltf',
    white: {
      primary: '#f5f5f5',
      fallback: '#FFFFFF',
    },
    black: {
      primary: '#2a2a2a',
      fallback: '#1a1a1a',
    },
    selection: {
      color: '#FFD700',
      emissive: '#FFD700',
      emissiveIntensity: 0.5,
    },
    scale: 0.02625,
    rotation: [Math.PI / 2, 0, 0],
  },
  moves: {
    valid: '#44FF44',
    capture: '#FF4444',
    opacity: 0.5,
    size: 0.4,
  },
  spacing: {
    mainBoardZSpacing: 5.4,
    attackBoardZOffset: 2.5,
  },
  lighting: {
    ambient: {
      intensity: 0.6,
    },
    directional: {
      position: [10, 10, 20],
      intensity: 1,
      shadowMapSize: 2048,
    },
  },
  camera: {
    position: [15, -6, 18],
    target: [0, 4, 4],
    presets: {
      front: { position: [0, -20, 6], target: [0, 0, 4] },
      side: { position: [20, 0, 6], target: [0, 4, 4] },
      top: { position: [0, 4, 25], target: [0, 4, 4] },
    },
  },
  grid: {
    size: 40,
    divisions: 40,
    position: [0, 0, -0.1],
    rotation: [Math.PI / 2, 0, 0],
  },
  ui: {
    background: '#1a1a1a',
    controlBackground: 'rgba(0, 0, 0, 0.8)',
    controlText: 'white',
    buttonBackground: '#4a5568',
    buttonHover: '#718096',
    statusBackground: {
      white: '#e8e8e8',
      black: '#333333',
      check: '#ffcc00',
      checkmate: '#ff0000',
    },
  },
};

/**
 * Star Trek TOS theme (acrylic blue/transparent aesthetic)
 */
const STAR_TREK_THEME: BoardTheme = {
  squares: {
    light: '#DDE6F5', // Clear/light transparent squares
    dark: '#1E3D8F', // Medium blue (main squares)
    opacity: 0.3, // Glass-like transparency for light squares
    gap: 0.1,
  },
  platforms: {
    whiteMain: '#C0C0C0', // Brushed silver frame
    neutralMain: '#C0C0C0', // Brushed silver frame
    blackMain: '#C0C0C0', // Brushed silver frame
    attack: '#C0C0C0', // Brushed silver frame
    opacity: 0.9, // More opaque for metallic look
    thickness: 0.2,
    gap: 0.2,
  },
  labels: {
    white: '#C0C0C0', // Silver
    neutral: '#C0C0C0', // Silver
    black: '#C0C0C0', // Silver
    attack: '#C0C0C0', // Silver
    size: 0.5,
  },
  pillars: {
    color: '#C2A14D', // Gold/brass pillar
    radius: 0.1,
  },
  pieces: {
    modelSet: 'basic',
    modelFormat: 'gltf',
    white: {
      primary: '#FFFFFF', // White primary
      fallback: '#FFFFFF',
      accent: '#C0C0C0', // Silver accent
    },
    black: {
      primary: '#2A2A2A', // Matte charcoal black
      fallback: '#2A2A2A',
      accent: '#C0C0C0', // Chrome accent
    },
    selection: {
      color: '#1E3D8F', // Blue to match board
      emissive: '#1E3D8F',
      emissiveIntensity: 0.6,
    },
    scale: 0.02625,
    rotation: [Math.PI / 2, 0, 0],
  },
  moves: {
    valid: '#00D4FF', // Cyan/sci-fi blue
    capture: '#FF4444',
    opacity: 0.6,
    size: 0.4,
  },
  spacing: {
    mainBoardZSpacing: 5.4,
    attackBoardZOffset: 2.5,
  },
  lighting: {
    ambient: {
      intensity: 0.7, // Slightly brighter for sci-fi look
    },
    directional: {
      position: [10, 10, 20],
      intensity: 1.2, // Stronger highlights on metallic surfaces
      shadowMapSize: 2048,
    },
  },
  camera: {
    position: [15, -6, 18],
    target: [0, 4, 4],
    presets: {
      front: { position: [0, -24, 15], target: [0, 0, 7] },
      side: { position: [-29, 4, 15], target: [0, 4, 7] },
      top: { position: [0, 4, 40], target: [0, 4, 7] },
    },
  },
  grid: {
    size: 40,
    divisions: 40,
    position: [0, 0, -0.1],
    rotation: [Math.PI / 2, 0, 0],
  },
  ui: {
    background: '#3C3C3C', // Neutral gray - Enterprise aesthetic (center)
    backgroundEdge: '#1E1E1E', // Darker edge for radial gradient
    controlBackground: 'rgba(30, 61, 143, 0.8)', // Blue tinted
    controlText: '#DDE6F5', // Light blue-white
    buttonBackground: '#1E3D8F',
    buttonHover: '#2E4D9F',
    statusBackground: {
      white: '#DDE6F5',
      black: '#1E3D8F',
      check: '#00D4FF',
      checkmate: '#FF4444',
    },
  },
};

/**
 * Available themes
 */
export const THEMES = {
  classic: CLASSIC_THEME,
  starTrek: STAR_TREK_THEME,
} as const;

/**
 * Active theme selection
 *
 * 🎨 CHANGE THIS LINE TO SWITCH THEMES:
 * - 'classic' = Traditional wooden chess aesthetic
 * - 'starTrek' = TOS blue acrylic/transparent aesthetic
 */
export const ACTIVE_THEME: keyof typeof THEMES = 'starTrek';

/**
 * Current board theme (automatically uses ACTIVE_THEME)
 */
export const BOARD_THEME = THEMES[ACTIVE_THEME];

// Export individual sections for convenience
export const SQUARE_COLORS = BOARD_THEME.squares;
export const PLATFORM_COLORS = BOARD_THEME.platforms;
export const LABEL_COLORS = BOARD_THEME.labels;
export const PIECE_COLORS = BOARD_THEME.pieces;
export const MOVE_COLORS = BOARD_THEME.moves;
export const SPACING_CONFIG = BOARD_THEME.spacing;
export const LIGHTING_CONFIG = BOARD_THEME.lighting;
export const CAMERA_CONFIG = BOARD_THEME.camera;
export const UI_COLORS = BOARD_THEME.ui;
