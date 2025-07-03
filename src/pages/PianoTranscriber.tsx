import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioTranscriber from "@/components/AudioTranscriber";
import SheetMusicDisplay from "@/components/SheetMusicDisplay";
import PianoKeyboard from "@/components/PianoKeyboard";
import AudioControls from "@/components/AudioControls";

interface TranscribedNote {
  note: string;
  time: number;
  duration: number;
}

interface TranscriptionData {
  songTitle: string;
  notes: TranscribedNote[];
  duration: number;
}

const PianoTranscriber: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [transcriptionData, setTranscriptionData] =
    useState<TranscriptionData | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    setIsProcessing(true);
    // Simulate transcription process
    setTimeout(() => {
      const mockTranscription: TranscriptionData = {
        songTitle: file.name.replace(/\.[^/.]+$/, ""),
        notes: [
          { note: "C4", time: 0.5, duration: 0.5 },
          { note: "E4", time: 1.0, duration: 0.5 },
          { note: "G4", time: 1.5, duration: 0.5 },
          { note: "C5", time: 2.0, duration: 1.0 },
          // Add more mock notes as needed
        ],
        duration: 10, // seconds
      };
      setTranscriptionData(mockTranscription);
      setIsProcessing(false);
    }, 2000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveNotes([]);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);

    // Update active notes based on current time
    if (transcriptionData) {
      const currentNotes = transcriptionData.notes
        .filter((note) => time >= note.time && time < note.time + note.duration)
        .map((note) => note.note);
      setActiveNotes(currentNotes);
    }
  };

  const handleExportPDF = () => {
    // PDF export functionality would be implemented here
    console.log("Exporting sheet music as PDF");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Piano Transcription App</h1>
        <p className="text-muted-foreground">
          Upload audio to transcribe music into sheet music and piano notes
        </p>
      </header>

      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-6">
          <AudioTranscriber
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
          />
        </CardContent>
      </Card>

      {transcriptionData && (
        <div className="space-y-6 w-full max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <SheetMusicDisplay
                songTitle={transcriptionData.songTitle}
                notes={transcriptionData.notes}
                currentTime={currentTime}
                onExportPDF={handleExportPDF}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <PianoKeyboard activeNotes={activeNotes} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <AudioControls
                audioFile={audioFile}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={transcriptionData.duration}
                onPlayPause={handlePlayPause}
                onStop={handleStop}
                onTimeUpdate={handleTimeUpdate}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {!transcriptionData && !isProcessing && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Upload an audio file to get started
          </h2>
          <p className="text-muted-foreground max-w-md">
            The system will transcribe your music, display sheet music, and
            highlight piano keys as the music plays.
          </p>
        </div>
      )}
    </div>
  );
};

export default PianoTranscriber;
