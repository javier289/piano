import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mic } from "lucide-react";

interface LyricsTranscriptionProps {
  songTitle?: string;
  lyrics?: Array<{
    text: string;
    note: string;
    time: number;
    duration: number;
  }>;
  currentTime?: number;
  onExportPDF?: () => void;
  isLoading?: boolean;
}

const LyricsTranscription = ({
  songTitle = "Untitled Song",
  lyrics = [],
  currentTime = 0,
  onExportPDF = () => {},
  isLoading = false,
}: LyricsTranscriptionProps) => {
  // Helper function to convert note names to solfège (DO, RE, MI...)
  const noteToSolfege = (note: string): string => {
    const noteName = note.replace(/[0-9]/g, ""); // Remove octave number
    const solfegeMap: Record<string, string> = {
      C: "DO",
      "C#": "DO#",
      Db: "RE♭",
      D: "RE",
      "D#": "RE#",
      Eb: "MI♭",
      E: "MI",
      F: "FA",
      "F#": "FA#",
      Gb: "SOL♭",
      G: "SOL",
      "G#": "SOL#",
      Ab: "LA♭",
      A: "LA",
      "A#": "LA#",
      Bb: "SI♭",
      B: "SI",
    };
    return solfegeMap[noteName] || noteName;
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-200">
      <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {songTitle} - Lyrics
          </h2>
        </div>
        <Button
          onClick={onExportPDF}
          variant="outline"
          size="sm"
          disabled={isLoading || lyrics.length === 0}
          className="flex items-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
        >
          <Download size={16} />
          {isLoading ? "Exporting..." : "Export Lyrics PDF"}
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="bg-gradient-to-b from-purple-50 to-pink-50 p-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 shadow-inner p-6">
            {lyrics.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 font-semibold text-gray-600 border-b pb-2">
                  <div>Time</div>
                  <div>Lyrics</div>
                  <div>Note (Solfège)</div>
                </div>

                {lyrics.map((item, index) => {
                  const isActive =
                    currentTime >= item.time &&
                    currentTime < item.time + item.duration;

                  return (
                    <div
                      key={`lyric-${index}`}
                      className={`grid grid-cols-3 gap-4 py-2 border-b border-gray-100 transition-colors ${isActive ? "bg-purple-100" : ""}`}
                    >
                      <div className="text-gray-500">
                        {item.time.toFixed(2)}s
                      </div>
                      <div className="font-medium">{item.text}</div>
                      <div className="font-bold text-purple-700">
                        {noteToSolfege(item.note)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Lyrics Transcribed Yet
                </h3>
                <p className="text-gray-500 italic max-w-md">
                  Upload an audio file with vocals to transcribe lyrics with
                  musical notes
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LyricsTranscription;
