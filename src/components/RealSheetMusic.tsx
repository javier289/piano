import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RealSheetMusicProps {
  songTitle?: string;
  notes?: Array<{ note: string; time: number; duration: number }>;
  currentTime?: number;
}

const RealSheetMusic = ({
  songTitle = "Untitled Song",
  notes = [],
  currentTime = 0,
}: RealSheetMusicProps) => {
  // Function to render staff lines
  const renderStaffLines = () => {
    return (
      <div className="staff-lines relative w-full h-64 mb-8">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={`line-${index}`}
            className="absolute w-full h-0.5 bg-gray-800"
            style={{ top: `${index * 16}px` }}
          />
        ))}

        {/* Render notes on staff */}
        {notes.map((note, index) => {
          // Simple positioning based on note name (very basic)
          const notePosition = getNotePosition(note.note);
          const isActive =
            currentTime >= note.time && currentTime < note.time + note.duration;

          return (
            <div
              key={`note-${index}`}
              className={`absolute w-8 h-8 flex items-center justify-center
                        ${isActive ? "text-blue-600" : "text-black"}`}
              style={{
                left: `${note.time * 50 + 40}px`,
                top: `${notePosition}px`,
              }}
            >
              ♩
            </div>
          );
        })}

        {/* Clef */}
        <div className="absolute left-2 top-0 text-3xl">𝄞</div>
      </div>
    );
  };

  // Very basic function to position notes on staff
  const getNotePosition = (noteName: string) => {
    const noteMap: Record<string, number> = {
      C5: 0,
      B4: 8,
      A4: 16,
      G4: 24,
      F4: 32,
      E4: 40,
      D4: 48,
      C4: 56,
      B3: 64,
      A3: 72,
    };

    return noteMap[noteName] || 40; // Default position if note not found
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">{songTitle}</h2>
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] bg-amber-50 p-6 rounded-lg">
            {renderStaffLines()}
          </div>
        </div>
        <p className="text-sm text-center text-gray-500 mt-4">
          Sheet music notation (simplified representation)
        </p>
      </CardContent>
    </Card>
  );
};

export default RealSheetMusic;
