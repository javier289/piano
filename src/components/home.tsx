import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/piano");
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Piano Transcription App
        </h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default Home;
