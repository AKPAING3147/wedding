"use client";

import React from "react";

export default function LiquidBackground() {
    return (
        <div className="liquid-bg-container">
            <style jsx global>{`
        .liquid-bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
          background: #ffffff; /* Fallback/Base */
          pointer-events: none;
        }

        .blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.8;
          animation: float 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }

        .blob-1 {
          top: -10%;
          left: -10%;
          width: 50vw;
          height: 50vw;
          background: #ff9a9e;
          animation-delay: 0s;
        }

        .blob-2 {
          top: -10%;
          right: -10%;
          width: 60vw;
          height: 60vw;
          background: #a18cd1;
          animation-delay: -5s;
        }

        .blob-3 {
          bottom: -20%;
          left: 20%;
          width: 50vw;
          height: 50vw;
          background: #fad0c4;
          animation-delay: -10s;
        }
        
        .blob-4 {
          bottom: -10%;
          right: -10%;
          width: 40vw;
          height: 40vw;
          background: #fbc2eb;
          animation-delay: -15s;
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
             transform: translate(30px, -50px) rotate(10deg) scale(1.1);
          }
          66% {
             transform: translate(-20px, 20px) rotate(-5deg) scale(0.9);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }

        /* Glass overlay for the "liquid" feel */
        .glass-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(100px); /* Heavy blur to blend everything */
          -webkit-backdrop-filter: blur(100px);
          background: rgba(255, 255, 255, 0.3); /* Lighten it up */
        }
      `}</style>

            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="blob blob-4"></div>

            {/* Optional: Noise texture or extra blur layer */}
            <div className="glass-overlay"></div>
        </div>
    );
}
