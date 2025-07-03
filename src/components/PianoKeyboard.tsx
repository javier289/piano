import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PianoKeyboardProps {
  activeNotes?: string[];
  onKeyPress?: (note: string) => void;
  octaveRange?: [number, number];
}

const PianoKeyboard = ({
  activeNotes = [],
  onKeyPress = () => {},
  octaveRange = [2, 6],
}: PianoKeyboardProps) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Define the notes in an octave
  const whiteNotes = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes = ["C#", "D#", "F#", "G#", "A#"];
  const blackNotePositions = [0, 1, 3, 4, 5]; // Positions relative to white keys

  // Generate all notes based on octave range
  const generateKeys = () => {
    const keys = [];
    for (let octave = octaveRange[0]; octave <= octaveRange[1]; octave++) {
      whiteNotes.forEach((note) => {
        keys.push(`${note}${octave}`);
      });
    }
    return keys;
  };

  const whiteKeys = generateKeys();

  // Handle key press
  const handleKeyPress = (note: string) => {
    onKeyPress(note);
    setHoveredKey(note);
    setTimeout(() => setHoveredKey(null), 300);
  };

  // Check if a note is active
  const isNoteActive = (note: string) => {
    return activeNotes.includes(note);
  };

  // Render black keys for a specific white key
  const renderBlackKey = (whiteKeyIndex: number) => {
    const octaveIndex = Math.floor(whiteKeyIndex / 7);
    const noteIndex = whiteKeyIndex % 7;

    // Check if this position should have a black key
    const blackKeyIndex = blackNotePositions.indexOf(noteIndex);
    if (blackKeyIndex === -1) return null;

    const octave = octaveRange[0] + octaveIndex;
    const note = `${blackNotes[blackKeyIndex]}${octave}`;

    const isActive = isNoteActive(note);
    const isHovered = hoveredKey === note;

    return (
      <div
        key={note}
        className={cn(
          "absolute h-3/5 w-8 -ml-4 bg-black rounded-b-md cursor-pointer z-10 transition-colors",
          isActive || isHovered ? "bg-blue-500" : "bg-black",
          "hover:bg-blue-400",
        )}
        style={{ left: `calc(${whiteKeyIndex} * 3rem)` }}
        onClick={() => handleKeyPress(note)}
        onMouseDown={() => setHoveredKey(note)}
        onMouseUp={() => setHoveredKey(null)}
        onMouseLeave={() => hoveredKey === note && setHoveredKey(null)}
      />
    );
  };

  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="relative w-full overflow-x-auto pb-4">
        <div className="flex relative h-48 min-w-max">
          {/* White keys */}
          {whiteKeys.map((note, index) => {
            const isActive = isNoteActive(note);
            const isHovered = hoveredKey === note;

            return (
              <div
                key={note}
                className={cn(
                  "w-12 h-full border border-gray-300 rounded-b-md cursor-pointer transition-colors",
                  isActive || isHovered ? "bg-blue-200" : "bg-white",
                  "hover:bg-blue-100",
                )}
                onClick={() => handleKeyPress(note)}
                onMouseDown={() => setHoveredKey(note)}
                onMouseUp={() => setHoveredKey(null)}
                onMouseLeave={() => hoveredKey === note && setHoveredKey(null)}
              />
            );
          })}

          {/* Black keys */}
          <div className="absolute top-0 left-0 w-full">
            {whiteKeys.map((_, index) => renderBlackKey(index))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Click on keys to play notes or watch them highlight during playback
        </p>
      </div>
    </div>
  );
};

export default PianoKeyboard;
