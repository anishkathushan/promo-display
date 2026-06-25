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
  const previousStatusRef = useRef("no");

  const unlockAudio = () => {
    setAudioReady(true);
  };

  useEffect(() => {
    const statusRef = ref(db, SENSOR_STATUS_PATH);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const currentStatus = String(snapshot.val() || "no")
        .trim()
        .toLowerCase();

      const previousStatus = previousStatusRef.current;

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


// import { useEffect, useRef, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { db } from "./firebase";
// import "./App.css";

// const SENSOR_STATUS_PATH = "ir_breakbeam/status";
// const LOGO_SRC = import.meta.env.BASE_URL + "logo.png";
// const VIDEO_SRC = import.meta.env.BASE_URL + "promo.mp4";

// function App() {
//   const videoRef = useRef(null);

//   const [showVideo, setShowVideo] = useState(false);

//   const isPlayingRef = useRef(false);
//   const previousStatusRef = useRef("no");

//   const unlockAudio = () => {
//     console.log("Page clicked. Audio unlocked if browser allows it.");
//   };

//   useEffect(() => {
//     const statusRef = ref(db, SENSOR_STATUS_PATH);

//     const unsubscribe = onValue(statusRef, (snapshot) => {
//       const rawValue = snapshot.val();

//       // Firebase data printed here
//       console.log("Firebase raw value:", rawValue);

//       const currentStatus = String(rawValue || "no")
//         .trim()
//         .toLowerCase();

//       console.log("Processed status:", currentStatus);

//       const previousStatus = previousStatusRef.current;
//       console.log("Previous status:", previousStatus);

//       if (
//         currentStatus === "detected" &&
//         previousStatus !== "detected" &&
//         !isPlayingRef.current
//       ) {
//         console.log("Detected signal received. Playing video.");

//         isPlayingRef.current = true;
//         setShowVideo(true);
//       }

//       previousStatusRef.current = currentStatus;
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !showVideo) return;

//     video.currentTime = 0;
//     video.muted = false;
//     video.volume = 1.0;

//     video.play().catch((error) => {
//       console.log("Video autoplay with sound was blocked:", error);
//     });
//   }, [showVideo]);

//   const handleVideoEnded = () => {
//     console.log("Video ended. Returning to logo.");

//     isPlayingRef.current = false;
//     setShowVideo(false);
//   };

//   return (
//     <main className="screen" onClick={unlockAudio}>
//       {showVideo ? (
//         <section className="video-stage">
//           <video
//             ref={videoRef}
//             className="promo-video"
//             src={VIDEO_SRC}
//             preload="auto"
//             playsInline
//             onEnded={handleVideoEnded}
//           />
//         </section>
//       ) : (
//         <section className="logo-stage">
//           <img src={LOGO_SRC} alt="Brand logo" className="huge-logo" />
//         </section>
//       )}
//     </main>
//   );
// }

// export default App;
