/**
 * Zustand store for game state management
 * Connects UI with game engine
 */

import { create } from 'zustand';
import type { GameState, Piece, Position } from '../engine/types';
import {
  createInitialGameState,
  executeMove,
  selectPiece,
  deselectPiece,
  serializeGameState,
  deserializeGameState,
  undoLastMove,
} from '../engine/gameEngine';

interface GameStore extends GameState {
  // Actions
  selectPieceAction: (piece: Piece) => void;
  deselectPieceAction: () => void;
  movePiece: (piece: Piece, to: Position) => void;
  newGame: () => void;
  undoMove: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const STORAGE_KEY = 'tri_dim_chess_save';

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialGameState(),

  selectPieceAction: (piece: Piece) => {
    const state = get();
    const newState = selectPiece(state, piece);
    set(newState);
  },

  deselectPieceAction: () => {
    const state = get();
    const newState = deselectPiece(state);
    set(newState);
  },

  movePiece: (piece: Piece, to: Position) => {
    const state = get();
    const newState = executeMove(state, piece, to);
    if (newState) {
      set(newState);
    }
  },

  newGame: () => {
    set(createInitialGameState());
  },

  undoMove: () => {
    const state = get();
    const newState = undoLastMove(state);
    set(newState);
  },

  saveGame: () => {
    const state = get();
    const serialized = serializeGameState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  },

  loadGame: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const serialized = JSON.parse(saved);
        const state = deserializeGameState(serialized);
        set(state);
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    }
  },
}));
