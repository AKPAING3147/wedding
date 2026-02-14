"use client";

import React from "react";
import Image from "next/image";

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GiftModal({ isOpen, onClose }: GiftModalProps) {
    if (!isOpen) return null;

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
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90%",
                    maxWidth: "500px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "4px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    padding: "30px",
                    position: "relative",
                    imageRendering: "pixelated",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
          .pixel-btn-modal {
            background-color: #3498db;
            border: none;
            color: white;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin-top: 20px;
            cursor: pointer;
            font-family: 'Press Start 2P', cursive;
            box-shadow: 4px 4px 0px #2980b9;
            transition: all 0.1s;
          }
          .pixel-btn-modal:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #2980b9;
            background-color: #5dade2;
          }
          .pixel-btn-modal:active {
            transform: translate(2px, 2px);
            box-shadow: 0px 0px 0px #2980b9;
          }
        `}</style>

                <button className="pixel-close-btn" onClick={onClose}>X</button>

                <h2 style={{
                    fontFamily: "'Press Start 2P', system-ui",
                    fontSize: "1.2rem",
                    color: "#2c3e50",
                    textAlign: "center",
                    marginBottom: "20px",
                    textShadow: "2px 2px 0 #bdc3c7"
                }}>
                    KPay Contribution
                </h2>

                <div style={{
                    border: "4px solid #2c3e50",
                    padding: "10px",
                    backgroundColor: "white",
                    borderRadius: "8px"
                }}>
                    <Image
                        src="/kpay.jpg"
                        alt="KPay QR Code"
                        width={250}
                        height={250}
                        style={{
                            imageRendering: "pixelated",
                            objectFit: "contain"
                        }}
                    />
                </div>

                <button
                    className="pixel-btn-modal"
                    onClick={() => window.open('/kpay.jpg', '_blank')}
                >
                    Save QR Code
                </button>

            </div>
        </div>
    );
}
