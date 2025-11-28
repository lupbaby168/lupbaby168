import React, { useMemo } from 'react';
import { ClefType } from '../types';
import { CLEF_PATHS } from '../constants';

interface StaffProps {
  clef: ClefType;
  noteIndex: number; // 0 is the starting reference note for that clef
}

// Visual constants
const LINE_SPACING = 20;
const STAFF_TOP_Y = 60; // Top line Y position
const NOTE_RADIUS = 9;

const Staff: React.FC<StaffProps> = ({ clef, noteIndex }) => {
  
  // Determine reference logic based on Clef
  // We normalize visual position. 0 = The line where the Clef anchor is, or a standard C.
  // Let's standardise: 
  // Visual index 0 = Bottom Line (E4 in Treble)
  // Each step is half a space (10px)
  
  // Treble: Bottom line is E4. C4 (Middle C) is -2 visual steps (ledger line).
  // Bass: Bottom line is G2. C3 is +3 visual steps? 
  // Let's use "Lines from Bottom" as the metric. Bottom line = line 1.
  
  const getNoteVisualData = (cType: ClefType, nIndex: number) => {
    let stepsFromBottomLine = 0;
    
    // nIndex is passed from the Game Engine based on the "notesRange".
    // 0 in notesRange usually means C (Middle C or Low C).
    
    switch (cType) {
      case ClefType.TREBLE:
        // Range min 0 usually = Middle C (C4).
        // Middle C is one ledger line BELOW the staff.
        // Bottom line is E4.
        // C4 -> D4 -> E4. 
        // C4 is -2 steps from bottom line.
        stepsFromBottomLine = -2 + nIndex; 
        break;
      case ClefType.BASS:
        // Range 0 = C3 (Middle C is high). 
        // Actually for Bass, usually range starts lower.
        // Let's say nIndex 0 = C2 (Low C).
        // Standard Bass Clef: Bottom line is G2.
        // C2 is way below.
        // Let's align with the Level Config. 
        // Level 3 (Bass Basics): min 0. Let's assume 0 = C3 (Middle C - octave).
        // Bass Staff: Bottom G2, B2, D3, F3, A3.
        // C3 is Space 2 (between line 2 and 3). 
        // Steps from bottom line (G2): G2(0), A2(1), B2(2), C3(3).
        stepsFromBottomLine = 3 + nIndex; 
        // If nIndex is negative (e.g. -7 for C2): 3 - 7 = -4 (ledger lines below)
        break;
      case ClefType.ALTO:
        // C clef on Middle Line (Line 3).
        // Line 3 is 4 steps up from Line 1 (0, 1, 2, 3, 4). No, lines are 0, 2, 4, 6, 8 visual steps.
        // Bottom line (Line 1). Middle line (Line 3) is +4 visual half-steps? 
        // Line 1 -> Space 1 -> Line 2 -> Space 2 -> Line 3.
        // That is 4 steps.
        // So Middle C (nIndex 0) is at Step 4.
        stepsFromBottomLine = 4 + nIndex;
        break;
      case ClefType.TENOR:
        // C clef on 4th Line.
        // Line 1 -> ... -> Line 4.
        // Steps: 0 -> 2 -> 4 -> 6.
        // Middle C (nIndex 0) is at Step 6.
        stepsFromBottomLine = 6 + nIndex;
        break;
    }
    
    return stepsFromBottomLine;
  };

  const steps = getNoteVisualData(clef, noteIndex);
  
  // Calculate Y position
  // Bottom line Y is (STAFF_TOP_Y + 4 * LINE_SPACING)
  const bottomLineY = STAFF_TOP_Y + 4 * LINE_SPACING;
  // Each step is 10px (half space)
  const noteY = bottomLineY - (steps * (LINE_SPACING / 2));
  
  // Ledger Lines Logic
  const ledgerLines = [];
  // If steps < 0 (Below staff)
  if (steps < -1) { // -2 is C4 in Treble, needs line. -1 is D4, just below line.
    for (let i = -2; i >= steps; i -= 2) {
       ledgerLines.push(bottomLineY - (i * (LINE_SPACING / 2)));
    }
  }
  // If steps > 8 (Above staff) (Lines are 0, 2, 4, 6, 8)
  if (steps > 9) {
    for (let i = 10; i <= steps; i += 2) {
       ledgerLines.push(bottomLineY - (i * (LINE_SPACING / 2)));
    }
  }

  // Clef SVG Transform
  let clefPath = CLEF_PATHS[clef];
  let clefScale = 1;
  let clefTranslateX = 20;
  let clefTranslateY = STAFF_TOP_Y - 15;

  if (clef === ClefType.BASS) {
    clefScale = 1.2;
    clefTranslateY = STAFF_TOP_Y - 5;
  } else if (clef === ClefType.ALTO) {
    clefTranslateY = STAFF_TOP_Y - 10; // Center on line 3
    clefScale = 0.8;
  } else if (clef === ClefType.TENOR) {
    clefTranslateY = STAFF_TOP_Y - 20; // Shift up for Tenor
    clefScale = 0.8;
  }

  return (
    <div className="w-full flex justify-center items-center p-4 bg-white rounded-xl shadow-inner border-2 border-indigo-100 overflow-hidden">
      <svg width="300" height="200" viewBox="0 0 300 200">
        {/* Staff Lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="10"
            y1={STAFF_TOP_Y + i * LINE_SPACING}
            x2="290"
            y2={STAFF_TOP_Y + i * LINE_SPACING}
            stroke="#374151"
            strokeWidth="2"
          />
        ))}

        {/* Clef */}
        <g transform={`translate(${clefTranslateX}, ${clefTranslateY}) scale(${clefScale})`}>
          <path d={clefPath} fill="#111827" />
        </g>

        {/* Ledger Lines */}
        {ledgerLines.map((y, idx) => (
          <line
            key={`ledger-${idx}`}
            x1="130"
            y1={y}
            x2="170"
            y2={y}
            stroke="#374151"
            strokeWidth="2"
          />
        ))}

        {/* The Note */}
        <g transform={`translate(150, ${noteY})`}>
           <ellipse
             cx="0"
             cy="0"
             rx={NOTE_RADIUS * 1.3}
             ry={NOTE_RADIUS}
             fill="#000"
             transform="rotate(-15)"
           />
           {/* Stem */}
           {steps < 4 ? (
             // Stem Up
             <line x1={NOTE_RADIUS + 1} y1="0" x2={NOTE_RADIUS + 1} y2="-55" stroke="#000" strokeWidth="2" />
           ) : (
             // Stem Down
             <line x1={-(NOTE_RADIUS + 1)} y1="5" x2={-(NOTE_RADIUS + 1)} y2="55" stroke="#000" strokeWidth="2" />
           )}
        </g>
      </svg>
    </div>
  );
};

export default Staff;
