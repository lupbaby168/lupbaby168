export enum ClefType {
  TREBLE = 'TREBLE',
  BASS = 'BASS',
  ALTO = 'ALTO',
  TENOR = 'TENOR',
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
  COLLECTION = 'COLLECTION',
}

export interface Note {
  name: string; // C, D, E, F, G, A, B
  octave: number;
  position: number; // Visual position relative to center line
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  clef: ClefType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredScore: number;
  totalQuestions: number;
  notesRange: { min: number; max: number }; // Simplified range index
}

export interface Doll {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  dateUnlocked: string;
}

export interface RewardData {
  nickname: string;
  funFact: string;
}
