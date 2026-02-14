"use client";

import React, { useState } from "react";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText("83 Moo 3, Mueang Rayong District, Rayong 21000");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                backdropFilter: "blur(5px)",
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                style={{
                    width: "90%",
                    maxWidth: "700px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "4px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    padding: "20px",
                    position: "relative",
                    imageRendering: "pixelated",
                    borderRadius: "12px",
                    animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
            >
                <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .pixel-close-btn {
            position: absolute;
            top: -20px;
            right: -20px;
            width: 40px;
            height: 40px;
            background-color: #e74c3c;
            border: 4px solid #c0392b;
            color: white;
            font-family: 'Press Start 2P', system-ui;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.3);
            transition: transform 0.1s;
          }
          .pixel-close-btn:hover {
            transform: scale(1.1);
          }
           .modal-btn {
            background-color: #3498db;
            border: none;
            color: white;
            padding: 15px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 10px 5px;
            cursor: pointer;
            font-family: 'Press Start 2P', cursive;
            box-shadow: 4px 4px 0px #2980b9;
            transition: all 0.1s;
          }
          .modal-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #2980b9;
            background-color: #5dade2;
          }
          .modal-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #2980b9;
          }
        `}</style>

                {/* Close Button */}
                <button className="pixel-close-btn" onClick={onClose}>X</button>

                <h2 style={{
                    fontFamily: "'Press Start 2P', system-ui",
                    color: "#2c3e50",
                    fontSize: "1.2rem",
                    marginBottom: "20px",
                    textAlign: "center",
                    textShadow: "2px 2px 0 #ecf0f1",
                    lineHeight: "1.5"
                }}>
                    WEDDING LOCATION
                </h2>

                {/* Address */}
                <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "1.5rem",
                    color: "#2c3e50",
                    textAlign: "center",
                    marginBottom: "20px",
                    borderBottom: "2px dashed #bdc3c7",
                    paddingBottom: "15px"
                }}>
                    <strong>Mandalay, Myanmar</strong><br />
                    (Venue TBD)<br />
                </div>

                {/* Map Container */}
                <div style={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#ecf0f1",
                    border: "4px solid #2c3e50",
                    marginBottom: "20px",
                    position: "relative"
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        id="gmap_canvas"
                        src="https://maps.google.com/maps?q=Mandalay%2C%20Myanmar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    <button className="modal-btn" onClick={handleCopy}>
                        {copied ? "COPIED!" : "COPY ADDRESS"}
                    </button>

                    <a
                        href="https://maps.google.com/maps?q=Mandalay,+Myanmar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="modal-btn"
                        style={{ backgroundColor: "#2ecc71", boxShadow: "4px 4px 0px #27ae60" }}
                    >
                        GET DIRECTIONS
                    </a>
                </div>
            </div>
        </div>
    );
}
