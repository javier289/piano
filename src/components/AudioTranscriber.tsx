import React, { useState, useCallback } from "react";
import { Upload, UploadCloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioTranscriberProps {
  onTranscriptionComplete?: (data: {
    notes: Array<{ note: string; time: number; duration: number }>;
    songTitle: string;
  }) => void;
  onAudioLoaded?: (audioBuffer: AudioBuffer) => void;
  onFileUpload?: (file: File) => void;
  isProcessing?: boolean;
}

const AudioTranscriber = ({
  onTranscriptionComplete = () => {},
  onAudioLoaded = () => {},
  onFileUpload = () => {},
  isProcessing: externalProcessing = false,
}: AudioTranscriberProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("audio")) {
      handleFileSelection(droppedFile);
    } else {
      setError("Please upload an audio file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("uploading");
    setProgress(0);
    setError(null);
    onFileUpload(selectedFile);

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Simulate processing delay
      setTimeout(() => {
        clearInterval(uploadInterval);
        setStatus("processing");
        setProgress(100);

        // Simulate transcription process
        setTimeout(() => {
          processAudio(selectedFile);
        }, 2000);
      }, 3000);
    } catch (err) {
      setStatus("error");
      setError("Error uploading file. Please try again.");
    }
  };

  const processAudio = async (audioFile: File) => {
    try {
      // In a real implementation, this would connect to an API for transcription
      // For now, we'll simulate the process with mock data
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      onAudioLoaded(audioBuffer);

      // Mock transcription data with more notes for a richer example
      const mockTranscription = {
        notes: [
          { note: "C4", time: 0, duration: 0.5 },
          { note: "E4", time: 0.5, duration: 0.5 },
          { note: "G4", time: 1.0, duration: 0.5 },
          { note: "C5", time: 1.5, duration: 1.0 },
          { note: "A4", time: 2.5, duration: 0.5 },
          { note: "G4", time: 3.0, duration: 1.0 },
          { note: "F4", time: 4.0, duration: 0.5 },
          { note: "E4", time: 4.5, duration: 0.5 },
          { note: "D4", time: 5.0, duration: 0.5 },
          { note: "C4", time: 5.5, duration: 1.0 },
          { note: "D4", time: 6.5, duration: 0.5 },
          { note: "E4", time: 7.0, duration: 0.5 },
          { note: "F4", time: 7.5, duration: 0.5 },
          { note: "G4", time: 8.0, duration: 1.0 },
          { note: "A4", time: 9.0, duration: 0.5 },
          { note: "B4", time: 9.5, duration: 0.5 },
          { note: "C5", time: 10.0, duration: 1.0 },
          { note: "B4", time: 11.0, duration: 0.5 },
          { note: "A4", time: 11.5, duration: 0.5 },
          { note: "G4", time: 12.0, duration: 1.0 },
          { note: "F4", time: 13.0, duration: 0.5 },
          { note: "E4", time: 13.5, duration: 0.5 },
          { note: "D4", time: 14.0, duration: 0.5 },
          { note: "C4", time: 14.5, duration: 1.5 },
        ],
        songTitle: audioFile.name.replace(/\.[^/.]+$/, "") || "Untitled Song",
      };

      setStatus("complete");
      onTranscriptionComplete(mockTranscription);
    } catch (err) {
      setStatus("error");
      setError("Error processing audio. Please try a different file.");
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Uploading audio file...";
      case "processing":
        return "Transcribing music...";
      case "complete":
        return "Transcription complete!";
      case "error":
        return "Error processing file";
      default:
        return "Upload an audio file to begin";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <UploadCloud className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Audio</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop an audio file or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: MP3, WAV, FLAC, OGG (max 10MB)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={
                  status === "uploading" ||
                  status === "processing" ||
                  externalProcessing
                }
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={
                  status === "uploading" ||
                  status === "processing" ||
                  externalProcessing
                }
              />
            </div>

            {file && (
              <p className="text-sm font-medium">Selected: {file.name}</p>
            )}
          </div>
        </div>

        {(status === "uploading" || status === "processing") && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getStatusText()}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "complete" && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Transcription complete! Your sheet music is ready.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mt-4 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioTranscriber;
