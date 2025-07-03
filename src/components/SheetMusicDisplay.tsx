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
    <Card className="w-full bg-white shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">{songTitle}</h2>
        <Button
          onClick={exportToPDF}
          variant="outline"
          size="sm"
          disabled={isLoading || !sheetMusic}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          {isLoading ? "Exporting..." : "Export PDF"}
        </Button>
      </div>
      <CardContent
        className="p-6 overflow-auto bg-[#fffdf8]"
        style={{ height: "300px" }}
      >
        <div
          ref={sheetMusicRef}
          className="sheet-music-container min-h-[250px] w-full"
        >
          {sheetMusic ? (
            <div
              className="sheet-music-content"
              dangerouslySetInnerHTML={{ __html: sheetMusic }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 italic">
                Upload an audio file to generate sheet music
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SheetMusicDisplay;
