import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MusicalNotesProps {
  notes?: Array<{ note: string; time: number; duration: number }>;
  currentTime?: number;
}

const MusicalNotes = ({ notes = [], currentTime = 0 }: MusicalNotesProps) => {
  // Group notes by time for better visualization
  const groupedNotes = notes.reduce(
    (acc, note) => {
      const timeKey = note.time.toFixed(1);
      if (!acc[timeKey]) {
        acc[timeKey] = [];
      }
      acc[timeKey].push(note);
      return acc;
    },
    {} as Record<string, typeof notes>,
  );

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Musical Notes</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] flex flex-wrap gap-2">
            {Object.entries(groupedNotes).map(([time, timeNotes]) => {
              const timeNum = parseFloat(time);
              const isActive =
                currentTime >= timeNum && currentTime < timeNum + 0.5;

              return (
                <div
                  key={`time-${time}`}
                  className={`flex flex-col items-center p-3 rounded-md border 
                            ${isActive ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="text-xs text-gray-500 mb-1">{timeNum}s</div>
                  <div className="flex gap-1">
                    {timeNotes.map((note, idx) => (
                      <div
                        key={`note-${time}-${idx}`}
                        className={`px-2 py-1 rounded font-mono text-sm 
                                  ${isActive ? "bg-blue-200 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {note.note}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicalNotes;
