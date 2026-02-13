"use client";

import { useState, useEffect } from "react";
import ReactHowler from "react-howler";

export default function MusicPlayer() {
    const [playing, setPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted) {
                setPlaying(true);
                setHasInteracted(true);
            }
        };

        // Add listeners for any user interaction to start music
        window.addEventListener("scroll", handleInteraction, { capture: true }); // Capture phase for scroll
        window.addEventListener("wheel", handleInteraction);
        window.addEventListener("click", handleInteraction);
        window.addEventListener("touchstart", handleInteraction);
        window.addEventListener("keydown", handleInteraction);

        if (hasInteracted) {
            window.removeEventListener("scroll", handleInteraction, { capture: true });
            window.removeEventListener("wheel", handleInteraction);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        }

        return () => {
            window.removeEventListener("scroll", handleInteraction, { capture: true });
            window.removeEventListener("wheel", handleInteraction);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [hasInteracted]);

    const togglePlay = () => {
        setPlaying(!playing);
        setHasInteracted(true); // Treat manual toggle as interaction
    };

    return (
        <div style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
        }}>
            <ReactHowler
                src="/bg.mp3"
                playing={playing}
                loop={true}
                volume={0.5}
            />

            <button
                onClick={togglePlay}
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    border: "4px solid #333",
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontFamily: "'Courier New', monospace",
                    fontSize: "1.5rem",
                    color: playing ? "#FF69B4" : "#333", // Pink when playing, Dark when paused
                    textShadow: "none",
                }}
            >
                {playing ? "♫" : "▶"}
            </button>
        </div>
    );
}
