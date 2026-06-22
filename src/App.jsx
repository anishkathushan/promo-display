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

  const isPlayingRef = useRef(false);
  const previousStatusRef = useRef("y");

  useEffect(() => {
    const statusRef = ref(db, SENSOR_STATUS_PATH);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const currentStatus = String(snapshot.val() || "y")
        .trim()
        .toLowerCase();

      const previousStatus = previousStatusRef.current;

      // Start video only when status changes from no to yes
      // Do not restart if video is already playing
      if (
        currentStatus === "detected" &&
        previousStatus !== "detected" &&
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
      console.log("Video autoplay with sound was blocked:", error);
    });
  }, [showVideo]);

  const handleVideoEnded = () => {
    isPlayingRef.current = false;
    setShowVideo(false);
  };

  return (
    <main className="screen">
      {showVideo ? (
        <section className="video-stage">
          <video
            ref={videoRef}
            className="promo-video"
            src={VIDEO_SRC}
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
