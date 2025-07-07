import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, Volume2 } from "lucide-react";
import * as Tone from "tone";

interface AudioPlayerProps {
  audioFile?: File | null;
  notes?: Array<{ note: string; time: number; duration: number }>;
  onPlaybackTimeChange?: (time: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const AudioPlayer = ({
  audioFile = null,
  notes = [],
  onPlaybackTimeChange = () => {},
  onPlayStateChange = () => {},
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);

  const playerRef = useRef<Tone.Player | null>(null);
  const intervalRef = useRef<number | null>(null);
  const synth = useRef<Tone.Synth | null>(null);

  // Initialize Tone.js
  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      if (synth.current) {
        synth.current.dispose();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Load audio file when it changes
  useEffect(() => {
    if (audioFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Dispose previous player if exists
          if (playerRef.current) {
            playerRef.current.dispose();
          }

          // Create new player with the audio file
          const buffer = await Tone.Buffer.fromUrl(e.target.result as string);
          playerRef.current = new Tone.Player(buffer).toDestination();
          setDuration(buffer.duration);
        }
      };
      reader.readAsDataURL(audioFile);
    }
  }, [audioFile]);

  // Handle play/pause
  const togglePlayback = async () => {
    if (!playerRef.current) return;

    await Tone.start();

    if (isPlaying) {
      playerRef.current.stop();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      playerRef.current.start(0, currentTime);

      // Update time during playback
      intervalRef.current = window.setInterval(() => {
        const newTime = playerRef.current?.now() || 0;
        setCurrentTime(newTime);
        onPlaybackTimeChange(newTime);

        // Play notes at the right time
        playNotesAtTime(newTime);

        if (newTime >= duration) {
          setIsPlaying(false);
          onPlayStateChange(false);
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }, 100) as unknown as number;
    }

    setIsPlaying(!isPlaying);
    onPlayStateChange(!isPlaying);
  };

  // Reset playback
  const resetPlayback = () => {
    if (playerRef.current) {
      playerRef.current.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentTime(0);
    onPlaybackTimeChange(0);
    setIsPlaying(false);
    onPlayStateChange(false);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume.value = Tone.gainToDb(newVolume / 100);
    }
  };

  // Play notes at the current time
  const playNotesAtTime = (time: number) => {
    if (!synth.current) return;

    notes.forEach((note) => {
      // Check if we just crossed this note's start time
      if (time >= note.time && time <= note.time + 0.1) {
        synth.current?.triggerAttackRelease(note.note, note.duration);
      }
    });
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayback}
          disabled={!audioFile}
          className="h-10 w-10"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={resetPlayback}
          disabled={!audioFile}
          className="h-10 w-10"
        >
          <SkipBack size={20} />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-gray-500 w-10">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            className="flex-1"
            onValueChange={(value) => {
              setCurrentTime(value[0]);
              onPlaybackTimeChange(value[0]);
              if (playerRef.current && isPlaying) {
                playerRef.current.stop();
                playerRef.current.start(0, value[0]);
              }
            }}
          />
          <span className="text-xs text-gray-500 w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2 w-32">
          <Volume2 size={16} className="text-gray-500" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
