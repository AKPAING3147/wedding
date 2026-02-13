
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function PixelRunners() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1, // Just above background (0), below content
                overflow: "hidden",
            }}
        >
            <style jsx>{`
        @keyframes runRight {
          0% {
            transform: translateX(-100px) scaleX(1);
          }
          100% {
            transform: translateX(100vw) scaleX(1);
          }
        }

        @keyframes runLeft {
          0% {
            transform: translateX(100vw) scaleX(-1);
          }
          100% {
            transform: translateX(-100px) scaleX(-1);
          }
        }

        .runner-1 {
          position: absolute;
          bottom: 10%; /* Adjust height as needed */
          left: 0;
          width: 80px; /* Adjust size */
          height: auto;
          image-rendering: pixelated;
          animation: runRight 15s linear infinite;
        }

        .runner-2 {
          position: absolute;
          bottom: 15%; /* Different height */
          left: 0;
          width: 80px;
          height: auto;
          image-rendering: pixelated;
          animation: runLeft 20s linear infinite;
          animation-delay: 2s;
        }
      `}</style>

            {/* Runner 1 - Runs Left to Right */}
            <img
                src="/run1.svg"
                alt="Runner 1"
                className="runner-1"
            />

            {/* Runner 2 - Runs Right to Left */}
            <img
                src="/run2.svg"
                alt="Runner 2"
                className="runner-2"
            />
        </div>
    );
}
