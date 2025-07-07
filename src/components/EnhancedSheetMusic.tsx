import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Music } from "lucide-react";
import * as ABCJS from "abcjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface EnhancedSheetMusicProps {
  songTitle?: string;
  notes?: Array<{ note: string; time: number; duration: number }>;
  lyrics?: Array<{
    text: string;
    note: string;
    time: number;
    duration: number;
  }>;
  currentTime?: number;
  isPlaying?: boolean;
}

const EnhancedSheetMusic = ({
  songTitle = "Untitled Song",
  notes = [],
  lyrics = [],
  currentTime = 0,
  isPlaying = false,
}: EnhancedSheetMusicProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const sheetMusicRef = useRef<HTMLDivElement>(null);
  const abcNotationRef = useRef<string>("");

  // Convert notes to ABC notation
  useEffect(() => {
    if (notes.length === 0) return;

    // Sort notes by time
    const sortedNotes = [...notes].sort((a, b) => a.time - b.time);

    // Basic ABC notation header
    let abcNotation = `X:1\n`;
    abcNotation += `T:${songTitle}\n`;
    abcNotation += `M:4/4\n`; // Default time signature
    abcNotation += `L:1/8\n`; // Default note length
    abcNotation += `K:C\n`; // Default key

    // Add notes
    let currentPosition = 0;
    sortedNotes.forEach((note, index) => {
      // Convert scientific pitch notation to ABC notation
      const abcNote = convertToABCNotation(note.note);

      // Calculate note length (very simplified)
      const noteLength = Math.max(1, Math.round(note.duration * 8)); // Convert to eighth notes

      // Add lyrics if available
      const matchingLyric = lyrics.find(
        (l) => Math.abs(l.time - note.time) < 0.1,
      );
      const lyricText = matchingLyric ? `"${matchingLyric.text}"` : "";

      // Add the note with its duration
      abcNotation += `${lyricText}${abcNote}${noteLength} `;

      // Add bar lines roughly every 4 beats
      currentPosition += noteLength;
      if (currentPosition >= 32 && index < sortedNotes.length - 1) {
        abcNotation += "| \n";
        currentPosition = 0;
      }
    });

    abcNotation += "|]";
    abcNotationRef.current = abcNotation;

    // Render the ABC notation
    if (sheetMusicRef.current) {
      sheetMusicRef.current.innerHTML = "";
      ABCJS.renderAbc(sheetMusicRef.current, abcNotation, {
        responsive: "resize",
        add_classes: true,
        paddingleft: 0,
        paddingright: 0,
        paddingbottom: 10,
        paddingtop: 10,
      });
    }
  }, [notes, lyrics, songTitle]);

  // Function to convert scientific pitch notation to ABC notation
  const convertToABCNotation = (scientificNote: string): string => {
    const match = scientificNote.match(/([A-G][#b]?)([0-9])/);
    if (!match) return "C";

    const [, noteName, octave] = match;
    const octaveNum = parseInt(octave, 10);

    // In ABC notation:
    // C4 is middle C, written as "C"
    // Notes below middle C are written as "C," (with commas)
    // Notes above middle C are written as "c" (lowercase)
    // Higher octaves add more lowercase letters, lower octaves add more commas

    let abcNote = noteName;

    if (octaveNum < 4) {
      // Add commas for lower octaves
      abcNote += ",".repeat(4 - octaveNum);
    } else if (octaveNum > 4) {
      // Use lowercase for higher octaves
      abcNote = abcNote.toLowerCase();
      // Add apostrophes for even higher octaves
      if (octaveNum > 5) {
        abcNote += "'".repeat(octaveNum - 5);
      }
    }

    return abcNote;
  };

  // Function to export sheet music as PDF
  const exportToPDF = async () => {
    if (!sheetMusicRef.current) return;

    setIsLoading(true);

    try {
      const canvas = await html2canvas(sheetMusicRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });

      // Calculate dimensions to fit the image properly
      const imgWidth = 277; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Add lyrics page if available
      if (lyrics.length > 0) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text(`${songTitle} - Lyrics with Notes`, 10, 20);

        pdf.setFontSize(12);
        let yPos = 40;

        lyrics.forEach((item, index) => {
          const noteText = item.note.replace(/[0-9]/g, ""); // Remove octave number
          const text = `${item.time.toFixed(1)}s: "${item.text}" - ${noteText}`;
          pdf.text(text, 20, yPos);
          yPos += 10;

          // Add new page if needed
          if (yPos > 270 && index < lyrics.length - 1) {
            pdf.addPage();
            yPos = 20;
          }
        });
      }

      pdf.save(`${songTitle.replace(/\s+/g, "_")}_sheet_music.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-2 border-gray-200">
      <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Music className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{songTitle}</h2>
        </div>
        <Button
          onClick={exportToPDF}
          variant="outline"
          size="sm"
          disabled={isLoading || notes.length === 0}
          className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
        >
          <Download size={16} />
          {isLoading ? "Exporting..." : "Export Sheet Music"}
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="bg-gradient-to-b from-amber-50 to-yellow-50 p-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 shadow-inner p-4">
            {notes.length > 0 ? (
              <div
                ref={sheetMusicRef}
                className="sheet-music-container min-h-[300px] w-full overflow-auto"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Sheet Music Yet
                </h3>
                <p className="text-gray-500 italic max-w-md">
                  Upload an audio file to generate beautiful sheet music
                  notation
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSheetMusic;
