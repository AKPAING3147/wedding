"use client";

import { useState } from "react";
import Image from "next/image";

interface PixelGalleryProps {
    images?: string[];
}

export default function PixelGallery({ images = [] }: PixelGalleryProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Default images
    const sourceImages = images.length > 0 ? images : [
        "/img1.jpg",
        "/img2.jpg",
        "/Groom.png",
        "/img3.jpg",
        "/img4.jpg",
        "/bridge.png",
        "/img5.jpg",
        "/img6.jpg"
    ];

    // Duplicate images to create a seamless loop
    // row1: Original order
    const row1 = [...sourceImages, ...sourceImages, ...sourceImages];
    // row2: Reversed order (create copy first to avoid mutation)
    const reversedImages = [...sourceImages].reverse();
    const row2 = [...reversedImages, ...reversedImages, ...reversedImages];

    const pinColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#FF6B6B", "#4ECDC4", "#FFE66D"];

    return (
        <div style={{
            width: "100%",
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            position: "relative",
            overflow: "hidden", // Hide scrollbars used for marquee
            paddingBottom: "20px"
        }}>
            {/* Styles for Marquee */}
            <style>{`
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Move 1/3 since we tripled content */
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-33.33%); }
                    100% { transform: translateX(0); }
                }
                .gallery-track {
                    display: flex;
                    gap: 30px;
                    width: max-content;
                }
                .track-left {
                    animation: scrollLeft 30s linear infinite;
                }
                .track-right {
                    animation: scrollRight 35s linear infinite;
                }
                /* Pause on hover */
                .gallery-container:hover .track-left,
                .gallery-container:hover .track-right {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Title */}
            <div style={{
                zIndex: 10,
                marginBottom: "20px"
            }}>
                <h2 style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontSize: "2.5rem",
                    color: "#333",
                    margin: 0,
                    backgroundColor: "#fff",
                    padding: "10px 40px",
                    border: "4px solid #000",
                    boxShadow: "6px 6px 0px rgba(0,0,0,0.2)",
                    textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
                }}>
                    MOMENTS
                </h2>
                <span style={{ position: "absolute", top: "-15px", right: "-25px", fontSize: "30px" }}>✨</span>
            </div>

            {/* Marquee Container */}
            <div className="gallery-container" style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                overflowX: "hidden"
            }}>

                {/* Row 1: Left Scroll */}
                <div className="gallery-track track-left">
                    {row1.map((src, index) => (
                        <Polaroid
                            key={`r1-${index}`}
                            src={src}
                            index={index}
                            pinColor={pinColors[index % pinColors.length]}
                        />
                    ))}
                </div>

                {/* Row 2: Right Scroll */}
                <div className="gallery-track track-right">
                    {row2.map((src, index) => (
                        <Polaroid
                            key={`r2-${index}`}
                            src={src}
                            index={index}
                            pinColor={pinColors[(index + 2) % pinColors.length]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sub-component for individual item to keep main clean
function Polaroid({ src, index, pinColor }: any) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: "relative",
                width: "200px",
                height: "240px",
                backgroundColor: "#fff",
                padding: "10px 10px 50px 10px",
                boxShadow: isHovered
                    ? "0 20px 40px rgba(0,0,0,0.4)"
                    : "4px 8px 12px rgba(0,0,0,0.15)",
                transform: isHovered
                    ? "scale(1.1) rotate(0deg) translateY(-5px)"
                    : `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                zIndex: isHovered ? 100 : 1,
                transition: "all 0.3s ease-out",
                cursor: "pointer",
                border: "1px solid #ccc",
                flexShrink: 0,
            }}
        >
            {/* Pin */}
            <div style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: pinColor,
                border: "2px solid rgba(0,0,0,0.1)",
                boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                zIndex: 20
            }} />

            {/* Image */}
            <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                border: "1px solid #eee",
                overflow: "hidden",
            }}>
                <Image
                    src={src}
                    alt="Gallery"
                    fill
                    style={{
                        objectFit: "cover",
                        imageRendering: "pixelated",
                    }}
                />
            </div>

            {/* Caption Lines */}
            <div style={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                right: "15px",
            }}>
                <div style={{ height: "6px", width: "70%", backgroundColor: "#e0e0e0", marginBottom: "4px", borderRadius: "3px" }}></div>
                <div style={{ height: "6px", width: "40%", backgroundColor: "#e0e0e0", borderRadius: "3px" }}></div>
            </div>
        </div>
    )
}
