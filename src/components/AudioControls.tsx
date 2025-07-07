import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioControlsProps {
  audioFile?: File | null;
  onFileUpload?: (file: File) => void;
  onPlayPause?: () => void;
  onStop?: () => void;
  onTimeUpdate?: (time: number) => void;
  isPlaying?: boolean;
  isProcessing?: boolean;
  processingStatus?: string;
  currentTime?: number;
  duration?: number;
}

const AudioControls = ({
  audioFile = null,
  onFileUpload = () => {},
  onPlayPause = () => {},
  onStop = () => {},
  onTimeUpdate = () => {},
  isPlaying = false,
  isProcessing = false,
  processingStatus = "",
  currentTime = 0,
  duration = 100,
}: AudioControlsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePlayPause = () => {
    onPlayPause();
  };

  const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 rounded-lg border bg-background shadow-sm">
      <div className="flex flex-col gap-4">
        {/* File Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
          <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isProcessing
              ? processingStatus
              : "Drop audio file here or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports MP3, WAV, and other audio formats
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <Progress value={progressValue} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={isProcessing || !audioFile}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
            disabled={isProcessing || !audioFile}
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Message */}
        {isProcessing && (
          <div className="text-center text-sm text-muted-foreground">
            {processingStatus}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default AudioControls;
