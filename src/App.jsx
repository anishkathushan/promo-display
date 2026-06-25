import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";
import "./App.css";

const SENSOR_STATUS_PATH = "ir_breakbeam/status";
const LOGO_SRC = import.meta.env.BASE_URL + "logo.png";
const VIDEO_SRC = import.meta.env.BASE_URL + "promo.mp4";

function App() {
  const videoRef = useRef(null);

  const [showVideo, setShowVideo] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const isPlayingRef = useRef(false);
  const previousStatusRef = useRef("y");

  const unlockAudio = () => {
    setAudioReady(true);
  };

  useEffect(() => {
    const statusRef = ref(db, SENSOR_STATUS_PATH);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const currentStatus = String(snapshot.val() || "y")
        .trim()
        .toLowerCase();

      const previousStatus = previousStatusRef.current;

      if (
        currentStatus === "no" &&
        previousStatus !== "no" &&
        !isPlayingRef.current
      ) {
        isPlayingRef.current = true;
        setShowVideo(true);
      }

      previousStatusRef.current = currentStatus;
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;

    video.currentTime = 0;
    video.muted = false;
    video.volume = 1.0;

    video.play().catch((error) => {
      console.log("Sound autoplay blocked. Click the page once first.", error);
    });
  }, [showVideo]);

  const handleVideoEnded = () => {
    isPlayingRef.current = false;
    setShowVideo(false);
  };

  return (
    <main className="screen" onClick={unlockAudio}>
      {showVideo ? (
        <section className="video-stage">
          <video
            ref={videoRef}
            className="promo-video"
            src={VIDEO_SRC}
            preload="auto"
            playsInline
            onEnded={handleVideoEnded}
          />
        </section>
      ) : (
        <section className="logo-stage">
          <img src={LOGO_SRC} alt="Brand logo" className="huge-logo" />
        </section>
      )}
    </main>
  );
}

export default App;
