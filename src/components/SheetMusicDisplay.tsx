import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface SheetMusicDisplayProps {
  songTitle?: string;
  sheetMusic?: string;
  currentPosition?: number;
  isPlaying?: boolean;
}

const SheetMusicDisplay = ({
  songTitle = "Untitled Song",
  sheetMusic = "",
  currentPosition = 0,
  isPlaying = false,
}: SheetMusicDisplayProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const sheetMusicRef = React.useRef<HTMLDivElement>(null);

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
        orientation: "portrait",
        unit: "mm",
      });

      // Calculate dimensions to fit the image properly
      const imgWidth = 210; // A4 width in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${songTitle.replace(/\s+/g, "_")}.pdf`);
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
            <span className="text-white text-lg font-bold">♪</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{songTitle}</h2>
        </div>
        <Button
          onClick={exportToPDF}
          variant="outline"
          size="sm"
          disabled={isLoading || !sheetMusic}
          className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
        >
          <Download size={16} />
          {isLoading ? "Exporting..." : "Export PDF"}
        </Button>
      </div>
      <CardContent className="p-0">
        <div className="bg-gradient-to-b from-amber-50 to-yellow-50 p-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 shadow-inner">
            <div
              ref={sheetMusicRef}
              className="sheet-music-container min-h-[400px] w-full p-8 overflow-auto"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  transparent,
                  transparent 24px,
                  #e5e7eb 24px,
                  #e5e7eb 25px
                )`,
                backgroundSize: "100% 25px",
              }}
            >
              {sheetMusic ? (
                <div
                  className="sheet-music-content"
                  dangerouslySetInnerHTML={{ __html: sheetMusic }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white text-2xl">♫</span>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SheetMusicDisplay;
