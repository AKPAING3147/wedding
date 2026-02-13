"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
                setIsLoading(false);
                // Wait for transition to finish before unmounting
                setTimeout(() => {
                    setShouldRender(false);
                }, 500); // 500ms matches the CSS transition duration
            }, 1000); // Initial 1s delay
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #4da6ff 0%, #87CEEB 70%, #ffffff 100%)", // Matching Sky gradient
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "opacity 0.5s ease-out",
                opacity: isLoading ? 1 : 0,
                pointerEvents: isLoading ? "all" : "none",
            }}
        >
            <div style={{ position: "relative", width: "300px", height: "300px" }}>
                <Image
                    src="/loverlodaing.gif"
                    alt="Loading..."
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    unoptimized // GIFs sometimes need this to animate correctly in Next.js
                />
            </div>
        </div>
    );
}
