import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

import AudioTranscriber from "@/components/AudioTranscriber";
import SheetMusicDisplay from "@/components/SheetMusicDisplay";
import PianoKeyboard from "@/components/PianoKeyboard";
import AudioControls from "@/components/AudioControls";
import RealSheetMusic from "@/components/RealSheetMusic";
import MusicalNotes from "@/components/MusicalNotes";
import AudioPlayer from "@/components/AudioPlayer";
import LyricsTranscription from "@/components/LyricsTranscription";
import EnhancedSheetMusic from "@/components/EnhancedSheetMusic";
import LyricsSolfeggio from "@/components/LyricsSolfeggio";

interface TranscribedNote {
  note: string;
  time: number;
  duration: number;
}

interface TranscribedLyric {
  text: string;
  note: string;
  time: number;
  duration: number;
}

interface TranscriptionData {
  songTitle: string;
  notes: TranscribedNote[];
  lyrics: TranscribedLyric[];
  duration: number;
}

const PianoTranscriber: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [transcriptionData, setTranscriptionData] =
    useState<TranscriptionData | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  const handleFileUpload = (file: File) => {
    setAudioFile(file);
    setIsProcessing(true);
  };

  const handleAudioLoaded = (buffer: AudioBuffer) => {
    setAudioBuffer(buffer);
  };

  const handleTranscriptionComplete = (data: {
    notes: Array<{ note: string; time: number; duration: number }>;
    songTitle: string;
  }) => {
    // Generate mock lyrics for demonstration
    const mockLyrics = generateMockLyrics(data.notes);

    const transcriptionData: TranscriptionData = {
      songTitle: data.songTitle,
      notes: data.notes,
      lyrics: mockLyrics,
      duration: audioBuffer?.duration || 10, // Use actual duration if available
    };
    setTranscriptionData(transcriptionData);
    setIsProcessing(false);
  };

  // Helper function to generate mock lyrics based on notes
  const generateMockLyrics = (notes: TranscribedNote[]): TranscribedLyric[] => {
    const syllables = [
      "La",
      "Do",
      "Re",
      "Mi",
      "Fa",
      "Sol",
      "Oh",
      "Ah",
      "Hey",
      "Na",
    ];
    const words = [
      "Music",
      "Melody",
      "Rhythm",
      "Song",
      "Voice",
      "Sound",
      "Harmony",
      "Tempo",
    ];

    return notes
      .filter((_, i) => i % 3 === 0)
      .map((note, index) => {
        // Every few notes, use a word instead of a syllable
        const text =
          index % 4 === 0
            ? words[index % words.length]
            : syllables[index % syllables.length];

        return {
          text,
          note: note.note,
          time: note.time,
          duration: note.duration,
        };
      });
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

  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && transcriptionData) {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, transcriptionData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Piano Keyboard at the top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
        <div className="p-4">
          <PianoKeyboard activeNotes={activeNotes} />
        </div>
      </div>

      {/* Main content with top padding to account for fixed piano */}
      <div className="pt-64 p-6 flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Piano Transcription App</h1>
          <p className="text-gray-600">
            Upload audio to transcribe music into sheet music and piano notes
          </p>
        </header>

        <Card className="w-full max-w-6xl mx-auto">
          <CardContent className="p-6">
            <AudioTranscriber
              onFileUpload={handleFileUpload}
              onAudioLoaded={handleAudioLoaded}
              onTranscriptionComplete={handleTranscriptionComplete}
              isProcessing={isProcessing}
            />
          </CardContent>
        </Card>

        {transcriptionData && (
          <div className="space-y-6 w-full max-w-6xl mx-auto">
            {/* Enhanced Sheet Music with ABC Notation */}
            <Card>
              <CardContent className="p-6">
                <EnhancedSheetMusic
                  songTitle={transcriptionData.songTitle}
                  notes={transcriptionData.notes}
                  lyrics={transcriptionData.lyrics}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                />
              </CardContent>
            </Card>

            {/* Lyrics Transcription */}
            <Card>
              <CardContent className="p-6">
                <LyricsTranscription
                  songTitle={transcriptionData.songTitle}
                  lyrics={transcriptionData.lyrics}
                  currentTime={currentTime}
                />
              </CardContent>
            </Card>

            {/* Lyrics Solfeggio */}
            <Card>
              <CardContent className="p-6">
                <LyricsSolfeggio />
              </CardContent>
            </Card>

            {/* Real Sheet Music */}
            <Card>
              <CardContent className="p-6">
                <RealSheetMusic
                  songTitle={transcriptionData.songTitle}
                  notes={transcriptionData.notes}
                  currentTime={currentTime}
                />
              </CardContent>
            </Card>

            {/* Musical Notes Section */}
            <Card>
              <CardContent className="p-6">
                <MusicalNotes
                  notes={transcriptionData.notes}
                  currentTime={currentTime}
                />
              </CardContent>
            </Card>

            {/* Legacy Sheet Music Display */}
            <Card>
              <CardContent className="p-6">
                <SheetMusicDisplay
                  songTitle={transcriptionData.songTitle + " - PDF Export"}
                  sheetMusic={`
                    <div style="font-family: serif; line-height: 2;">
                      <div style="text-align: center; font-size: 18px; margin-bottom: 20px;">♪ ${transcriptionData.songTitle} ♪</div>
                      <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                        ${transcriptionData.notes
                          .map(
                            (note, i) =>
                              `<span style="display: inline-block; margin: 5px; padding: 8px 12px; background: #f0f0f0; border-radius: 4px; font-weight: bold;">
                            ${note.note} (${note.time.toFixed(1)}s)
                          </span>`,
                          )
                          .join("")}
                      </div>
                    </div>
                  `}
                  currentPosition={currentTime}
                  isPlaying={isPlaying}
                />
              </CardContent>
            </Card>

            {/* Advanced Audio Player */}
            <Card>
              <CardContent className="p-6">
                <AudioPlayer
                  audioFile={audioFile}
                  notes={transcriptionData.notes}
                  onPlaybackTimeChange={handleTimeUpdate}
                  onPlayStateChange={setIsPlaying}
                />
              </CardContent>
            </Card>

            {/* Legacy Audio Controls */}
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
                  onFileUpload={handleFileUpload}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {!transcriptionData && !isProcessing && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
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
                className="text-gray-500"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Upload an audio file to get started
            </h2>
            <p className="text-gray-600 max-w-md">
              The system will transcribe your music, display sheet music, and
              highlight piano keys as the music plays.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PianoTranscriber;
