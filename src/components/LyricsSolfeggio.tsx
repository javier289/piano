import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Music, Mic } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface LyricsSolfeggioProps {
  onTranscriptionComplete?: (data: {
    lyrics: Array<{
      text: string;
      note: string;
      solfege: string;
      time: number;
      duration: number;
    }>;
    songTitle: string;
  }) => void;
}

const LyricsSolfeggio = ({
  onTranscriptionComplete = () => {},
}: LyricsSolfeggioProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "complete" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [songTitle, setSongTitle] = useState("Canción sin título");
  const [lyrics, setLyrics] = useState<
    Array<{
      text: string;
      note: string;
      solfege: string;
      time: number;
      duration: number;
    }>
  >([]);
  const [isExporting, setIsExporting] = useState(false);
  const lyricsRef = useRef<HTMLDivElement>(null);

  // Helper function to convert note names to solfège
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("audio")) {
      handleFileSelection(droppedFile);
    } else {
      setError("Por favor, sube un archivo de audio");
    }
  };

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
    setSongTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));

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
      setError("Error al subir el archivo. Por favor, inténtalo de nuevo.");
    }
  };

  const processAudio = async (audioFile: File) => {
    try {
      // In a real implementation, this would connect to an API for transcription
      // For now, we'll simulate the process with mock data

      // Mock lyrics and notes data
      const mockLyrics = [
        { text: "Cómo", note: "C4", time: 0, duration: 0.5 },
        { text: "quieres", note: "E4", time: 0.5, duration: 0.5 },
        { text: "que", note: "G4", time: 1.0, duration: 0.3 },
        { text: "te", note: "A4", time: 1.3, duration: 0.2 },
        { text: "quiera", note: "C5", time: 1.5, duration: 1.0 },
        { text: "si", note: "B4", time: 2.5, duration: 0.5 },
        { text: "tú", note: "A4", time: 3.0, duration: 0.5 },
        { text: "no", note: "G4", time: 3.5, duration: 0.5 },
        { text: "me", note: "F4", time: 4.0, duration: 0.5 },
        { text: "quieres", note: "E4", time: 4.5, duration: 0.5 },
        { text: "a", note: "D4", time: 5.0, duration: 0.5 },
        { text: "mí", note: "C4", time: 5.5, duration: 1.0 },
      ];

      // Add solfege notation to each lyric
      const lyricsWithSolfege = mockLyrics.map((lyric) => ({
        ...lyric,
        solfege: noteToSolfege(lyric.note),
      }));

      setLyrics(lyricsWithSolfege);
      setStatus("complete");

      onTranscriptionComplete({
        lyrics: lyricsWithSolfege,
        songTitle: songTitle,
      });
    } catch (err) {
      setStatus("error");
      setError(
        "Error al procesar el audio. Por favor, prueba con un archivo diferente.",
      );
    }
  };

  const exportToPDF = async () => {
    if (!lyricsRef.current || lyrics.length === 0) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(lyricsRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
      });

      // Add title
      pdf.setFontSize(18);
      pdf.text(songTitle, 105, 20, { align: "center" });

      // Calculate dimensions to fit the image properly
      const imgWidth = 180; // Width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Center the image horizontally
      const xPos = (210 - imgWidth) / 2;

      pdf.addImage(imgData, "PNG", xPos, 30, imgWidth, imgHeight);
      pdf.save(`${songTitle.replace(/\s+/g, "_")}_letra_y_notas.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      setError("Error al generar el PDF. Por favor, inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return "Subiendo archivo de audio...";
      case "processing":
        return "Transcribiendo letra y notas...";
      case "complete":
        return "¡Transcripción completa!";
      case "error":
        return "Error al procesar el archivo";
      default:
        return "Sube un archivo de audio para comenzar";
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-200">
      <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Mic className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Transcripción de Letra y Notas
          </h2>
        </div>
      </div>

      <CardContent className="p-6">
        {status !== "complete" && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Music className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Subir Audio</h3>
                <p className="text-sm text-muted-foreground">
                  Arrastra y suelta un archivo de audio o haz clic para navegar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: MP3, WAV, FLAC, OGG (máx. 10MB)
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("lyrics-file-upload")?.click()
                  }
                  disabled={status === "uploading" || status === "processing"}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Seleccionar Archivo
                </Button>
                <input
                  id="lyrics-file-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={status === "uploading" || status === "processing"}
                />
              </div>

              {file && (
                <p className="text-sm font-medium">Seleccionado: {file.name}</p>
              )}
            </div>
          </div>
        )}

        {(status === "uploading" || status === "processing") && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{getStatusText()}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === "complete" && lyrics.length > 0 && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{songTitle}</h3>
              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                disabled={isExporting}
                className="flex items-center gap-2 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
              >
                <Download size={16} />
                {isExporting ? "Exportando..." : "Exportar PDF"}
              </Button>
            </div>

            <div
              ref={lyricsRef}
              className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-inner"
            >
              <div className="max-w-3xl mx-auto">
                {/* Lyrics display in a clean format */}
                <div className="space-y-8">
                  {/* Group lyrics into lines of 4-6 words each */}
                  {Array.from({ length: Math.ceil(lyrics.length / 4) }).map(
                    (_, lineIndex) => {
                      const lineStart = lineIndex * 4;
                      const lineEnd = Math.min(lineStart + 4, lyrics.length);
                      const lineItems = lyrics.slice(lineStart, lineEnd);

                      return (
                        <div key={`line-${lineIndex}`} className="space-y-2">
                          {/* Lyrics line */}
                          <div className="flex justify-center">
                            {lineItems.map((item, i) => (
                              <span
                                key={`lyric-${lineIndex}-${i}`}
                                className="px-2 text-lg font-medium"
                              >
                                {item.text}
                              </span>
                            ))}
                          </div>

                          {/* Notes line */}
                          <div className="flex justify-center">
                            {lineItems.map((item, i) => (
                              <span
                                key={`note-${lineIndex}-${i}`}
                                className="px-2 text-md font-bold text-purple-700"
                              >
                                {item.solfege}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
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

export default LyricsSolfeggio;
