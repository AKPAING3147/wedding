import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function WeddingLocation() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Animate once
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                marginBottom: "40px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
                opacity: isVisible ? 1 : 0,
                transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out"
            }}>

            {/* Container "Map Scroll" look */}
            <div style={{
                backgroundColor: "#f1c40f", // Gold/Parchment color
                border: "4px solid #d35400",
                borderRadius: "10px",
                boxShadow: "8px 8px 0 #c0392b",
                padding: "30px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative"
            }}>

                {/* Decorative Corner Pixels (CSS Mockup) */}
                <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "12px", height: "12px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "12px", height: "12px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", bottom: "-4px", left: "-4px", width: "12px", height: "12px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "12px", height: "12px", backgroundColor: "#d35400" }} />

                <h2 style={{
                    fontFamily: "'Press Start 2P', system-ui",
                    color: "#2c3e50",
                    fontSize: "1.5rem",
                    marginBottom: "20px",
                    textAlign: "center",
                    textShadow: "2px 2px 0 #ecf0f1"
                }}>
                    မင်္ဂလာပွဲကျင်းပမည့်နေရာ
                </h2>

                <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "1.8rem",
                    color: "#2c3e50",
                    textAlign: "center",
                    marginBottom: "20px"
                }}>
                    <strong>Wisdom Hotel & Residence</strong><br />
                    83 Moo 3, Mueang Rayong District,<br />
                    Rayong 21000
                </div>

                {/* Map Embed */}
                <div style={{
                    width: "100%",
                    height: "350px",
                    backgroundColor: "#ecf0f1",
                    border: "4px solid #2c3e50",
                    position: "relative",
                    marginBottom: "20px",
                    overflow: "hidden",
                    borderRadius: "4px"
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        id="gmap_canvas"
                        src="https://maps.google.com/maps?q=Wisdom%20Hotel%20%26%20Residence%20Rayong&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>

            </div>
        </div>
    );
}
