import React, { useState } from "react";

// Notas en solfeo y notación anglosajona
const NOTES = [
  { solfeo: "Do", anglo: "C" },
  { solfeo: "Do#", anglo: "C#" },
  { solfeo: "Re", anglo: "D" },
  { solfeo: "Re#", anglo: "D#" },
  { solfeo: "Mi", anglo: "E" },
  { solfeo: "Fa", anglo: "F" },
  { solfeo: "Fa#", anglo: "F#" },
  { solfeo: "Sol", anglo: "G" },
  { solfeo: "Sol#", anglo: "G#" },
  { solfeo: "La", anglo: "A" },
  { solfeo: "La#", anglo: "A#" },
  { solfeo: "Si", anglo: "B" },
];

// Indices de teclas negras
const BLACK_KEYS = [1, 3, 6, 8, 10];

const BeautifulPiano: React.FC = () => {
  const [activeNote, setActiveNote] = useState<number | null>(null);

  // Renderiza teclas blancas y negras superpuestas
  return (
    <div style={{
      width: "100%",
      maxWidth: 700,
      margin: "40px auto",
      padding: 24,
      background: "#222",
      borderRadius: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      position: "relative"
    }}>
      <h2 style={{ color: "#fff", textAlign: "center", marginBottom: 24 }}>Piano Virtual</h2>
      <div style={{ position: "relative", height: 180 }}>
        {/* Teclas blancas */}
        <div style={{ display: "flex", position: "absolute", width: "100%", height: 180, zIndex: 1 }}>
          {NOTES.filter((_, i) => !BLACK_KEYS.includes(i)).map((note, idx) => (
            <div
              key={note.anglo}
              onMouseDown={() => setActiveNote(idx)}
              onMouseUp={() => setActiveNote(null)}
              style={{
                flex: 1,
                height: "100%",
                margin: "0 2px",
                background: activeNote === idx ? "#ffe066" : "#fff",
                border: "1.5px solid #bbb",
                borderRadius: "0 0 8px 8px",
                boxShadow: activeNote === idx ? "0 0 16px #ffe066" : "0 2px 8px #aaa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                position: "relative",
                zIndex: 2,
                transition: "background 0.2s, box-shadow 0.2s"
              }}
            >
              <span style={{ fontSize: 18, color: "#222", fontWeight: 600 }}>{note.solfeo}</span>
              <span style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{note.anglo}</span>
            </div>
          ))}
        </div>
        {/* Teclas negras */}
        <div style={{ display: "flex", position: "absolute", width: "100%", height: 110, zIndex: 3, pointerEvents: "none" }}>
          {NOTES.map((note, i) =>
            BLACK_KEYS.includes(i) ? (
              <div
                key={note.anglo}
                style={{
                  width: "7.5%",
                  height: "100%",
                  marginLeft: i === 1 || i === 6 ? "-3.75%" : "-2.5%",
                  marginRight: i === 3 || i === 10 ? "-3.75%" : "-2.5%",
                  background: activeNote === i ? "#ffe066" : "#222",
                  border: "1.5px solid #444",
                  borderRadius: "0 0 6px 6px",
                  boxShadow: activeNote === i ? "0 0 16px #ffe066" : "0 2px 8px #111",
                  position: "relative",
                  zIndex: 4,
                  pointerEvents: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  transition: "background 0.2s, box-shadow 0.2s"
                }}
                onMouseDown={() => setActiveNote(i)}
                onMouseUp={() => setActiveNote(null)}
              >
                <span style={{ fontSize: 14, color: "#ffe066", fontWeight: 600 }}>{note.solfeo}</span>
                <span style={{ fontSize: 10, color: "#bbb", marginBottom: 6 }}>{note.anglo}</span>
              </div>
            ) : (
              <div key={note.anglo} style={{ width: "7.5%" }} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BeautifulPiano; 