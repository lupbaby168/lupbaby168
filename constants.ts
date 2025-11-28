import { ClefType, LevelConfig } from './types';

export const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Visual SVG Paths for Clefs
export const CLEF_PATHS = {
  [ClefType.TREBLE]: "M26.5 63.5C26.5 68 25 71 22 73.5C19 76 15 76.5 11.5 75.5C8 74.5 5.5 72 4 68.5C2.5 65 2.5 61 4 57.5C5.5 54 8.5 51.5 12 50.5C12.5 50.4 13 50.4 13.5 50.4C10.5 48.4 8.5 45.4 8.5 41.5C8.5 35.7 13.2 31 19 31C19.5 31 20 31 20.5 31.1C20.5 31.1 20.4 31 20.4 31C19.4 25.4 18.5 19.9 17.5 14.5C17.2 12.8 17 11 17 9.5C17 4.2 21.2 0 26.5 0C31.8 0 36 4.2 36 9.5C36 12.5 34.9 15.2 33 17.2C31.2 19.3 28.7 20.6 26 20.9L27.5 29.5C33.5 30.5 38 35.7 38 42C38 48.6 32.6 54 26 54C25.4 54 24.8 53.9 24.3 53.9C25.6 56.6 26.5 59.9 26.5 63.5ZM26 49.9C29.3 49.2 32 46.1 32 42C32 37.9 29.3 34.8 26 34.1L24.3 44.4C25.3 45.9 26 47.8 26 49.9ZM20.8 35.1L22.4 44.4C20.4 43.1 18.2 42.6 16 43.1C14.7 43.4 13.6 44 12.8 44.9C13.2 39.9 16.5 35.8 20.8 35.1ZM22.5 57.5L21.4 51.1C16.9 52.4 13.6 56.5 13.6 61.5C13.6 66.2 17.4 70 22.1 70C24.4 70 26.5 69.1 28.1 67.5C29.7 65.9 30.6 63.8 30.6 61.5C30.6 60.1 30.3 58.7 29.7 57.5H22.5ZM29.5 5.5C29.5 3.8 28.2 2.5 26.5 2.5C24.8 2.5 23.5 3.8 23.5 5.5C23.5 6.8 23.9 7.9 24.6 8.8L26.4 18.7C28.2 18.2 29.5 16.5 29.5 14.5V5.5Z",
  [ClefType.BASS]: "M12 16.5C12 12.4 15.4 9 19.5 9C23.6 9 27 12.4 27 16.5C27 20.6 23.6 24 19.5 24C18.6 24 17.7 23.8 16.9 23.5C19.3 26.6 20.6 30.5 20.6 34.5C20.6 44.7 12.4 53 2.1 53C1.4 53 0.7 52.9 0 52.8C1.8 56.9 5.9 60 10.6 60C16.7 60 21.6 55.1 21.6 49C21.6 47.3 21.2 45.7 20.6 44.2C24.1 41.8 26.5 37.9 26.5 33.5C26.5 30.2 25.4 27.2 23.6 24.7C26.2 23.1 28 20.1 28 16.5C28 11.8 24.2 8 19.5 8C14.8 8 11 11.8 11 16.5H12ZM34 16.5C34 17.9 35.1 19 36.5 19C37.9 19 39 17.9 39 16.5C39 15.1 37.9 14 36.5 14C35.1 14 34 15.1 34 16.5ZM34 25.5C34 26.9 35.1 28 36.5 28C37.9 28 39 26.9 39 25.5C39 24.1 37.9 23 36.5 23C35.1 23 34 24.1 34 25.5Z",
  [ClefType.ALTO]: "M20 0V60M20 30L0 30M20 30L35 15M20 30L35 45M35 15C38 15 40 18 40 22C40 26 38 29 35 30C38 31 40 34 40 38C40 42 38 45 35 45M20 0H10M20 60H10", // Simplified C-Clef representation
  [ClefType.TENOR]: "M20 0V60M20 30L0 30M20 30L35 15M20 30L35 45M35 15C38 15 40 18 40 22C40 26 38 29 35 30C38 31 40 34 40 38C40 42 38 45 35 45M20 0H10M20 60H10" // Visual is same as Alto, position changes
};

// Map Levels
// We provide Easy, Medium, Hard for each Clef
export const LEVELS: LevelConfig[] = [
  // --- TREBLE CLEF ---
  {
    id: 1,
    name: "高音入門 (Treble Easy)",
    description: "基礎五線譜練習 (C4 - G4)",
    clef: ClefType.TREBLE,
    difficulty: "Easy",
    requiredScore: 80,
    totalQuestions: 10,
    notesRange: { min: 0, max: 4 } // C4 to G4
  },
  {
    id: 2,
    name: "高音進階 (Treble Medium)",
    description: "包含一個八度音域 (C4 - C5)",
    clef: ClefType.TREBLE,
    difficulty: "Medium",
    requiredScore: 85,
    totalQuestions: 12,
    notesRange: { min: 0, max: 7 } // C4 to C5
  },
  {
    id: 3,
    name: "高音大師 (Treble Hard)",
    description: "挑戰更寬廣的音域 (G3 - G5)",
    clef: ClefType.TREBLE,
    difficulty: "Hard",
    requiredScore: 90,
    totalQuestions: 15,
    notesRange: { min: -3, max: 11 } // G3 to G5
  },

  // --- BASS CLEF ---
  {
    id: 4,
    name: "低音入門 (Bass Easy)",
    description: "低音譜號基礎 (C3 - G3)",
    clef: ClefType.BASS,
    difficulty: "Easy",
    requiredScore: 80,
    totalQuestions: 10,
    notesRange: { min: 0, max: 4 } // C3 to G3
  },
  {
    id: 5,
    name: "低音進階 (Bass Medium)",
    description: "擴展低音音域 (F2 - C4)",
    clef: ClefType.BASS,
    difficulty: "Medium",
    requiredScore: 85,
    totalQuestions: 12,
    notesRange: { min: -4, max: 7 } // F2 to C4
  },
  {
    id: 6,
    name: "低音大師 (Bass Hard)",
    description: "全方位低音挑戰 (E2 - E4)",
    clef: ClefType.BASS,
    difficulty: "Hard",
    requiredScore: 90,
    totalQuestions: 15,
    notesRange: { min: -5, max: 9 } // E2 to E4
  },

  // --- ALTO CLEF ---
  {
    id: 7,
    name: "中音入門 (Alto Easy)",
    description: "認識中音譜號 (F3 - C4)",
    clef: ClefType.ALTO,
    difficulty: "Easy",
    requiredScore: 80,
    totalQuestions: 10,
    notesRange: { min: -4, max: 0 } // F3 to C4
  },
  {
    id: 8,
    name: "中音進階 (Alto Medium)",
    description: "中提琴音域練習 (C3 - C4)",
    clef: ClefType.ALTO,
    difficulty: "Medium",
    requiredScore: 85,
    totalQuestions: 12,
    notesRange: { min: -7, max: 0 } // C3 to C4
  },
  {
    id: 9,
    name: "中音大師 (Alto Hard)",
    description: "完整中音挑戰 (C3 - G4)",
    clef: ClefType.ALTO,
    difficulty: "Hard",
    requiredScore: 90,
    totalQuestions: 15,
    notesRange: { min: -7, max: 4 } // C3 to G4
  },

  // --- TENOR CLEF ---
  {
    id: 10,
    name: "次中音入門 (Tenor Easy)",
    description: "大提琴高音區入門 (C3 - G3)",
    clef: ClefType.TENOR,
    difficulty: "Easy",
    requiredScore: 80,
    totalQuestions: 10,
    notesRange: { min: -7, max: -3 } // C3 to G3
  },
  {
    id: 11,
    name: "次中音進階 (Tenor Medium)",
    description: "更豐富的音域 (C3 - C4)",
    clef: ClefType.TENOR,
    difficulty: "Medium",
    requiredScore: 85,
    totalQuestions: 12,
    notesRange: { min: -7, max: 0 } // C3 to C4
  },
  {
    id: 12,
    name: "次中音大師 (Tenor Hard)",
    description: "專業級次中音譜號 (A2 - E4)",
    clef: ClefType.TENOR,
    difficulty: "Hard",
    requiredScore: 90,
    totalQuestions: 15,
    notesRange: { min: -9, max: 2 } // A2 to E4
  }
];