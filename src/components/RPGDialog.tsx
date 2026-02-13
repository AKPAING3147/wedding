"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const messages = [
    "မင်းရှိနေလို့ပဲ ကိုယ့်ဘဝက လှပသွားတာပါ",
    "ကိုယ့်ရဲ့အပြုံးတိုင်းမှာ မင်းရဲ့နာမည်ပါနေတယ်",
    "ကိုယ့်ရဲ့အနာဂတ်ဆိုတာ မင်းပါဝင်နေမှ ပြည့်စုံတယ်",
];

export default function RPGDialog() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        const text = messages[currentMessageIndex];
        const chars = Array.from(text); // Split by code points to handle Burmese better
        setDisplayedText("");
        setIsTyping(true);
        let charIndex = 0;
        let autoAdvanceTimer: NodeJS.Timeout;

        const typingInterval = setInterval(() => {
            if (charIndex < chars.length) {
                charIndex++;
                setDisplayedText(chars.slice(0, charIndex).join(""));
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                // Auto advance after 3 seconds
                autoAdvanceTimer = setTimeout(() => {
                    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
                }, 3000);
            }
        }, 80); // Adjust speed here

        return () => {
            clearInterval(typingInterval);
            clearTimeout(autoAdvanceTimer);
        };
    }, [currentMessageIndex]);

    const handleNext = () => {
        if (isTyping) {
            // Instant finish if clicked while typing
            setDisplayedText(messages[currentMessageIndex]);
            setIsTyping(false);
        } else {
            // Next message
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }
    };

    return (
        <div
            onClick={handleNext}
            style={{
                width: "90%",
                maxWidth: "600px",
                background: "rgba(34, 51, 102, 0.6)", // Semi-transparent pixel blue
                backdropFilter: "blur(4px)", // Glass blur effect
                border: "4px solid white",
                boxShadow: "0 0 0 4px #000, 8px 8px 0 rgba(0,0,0,0.5)",
                padding: "20px",
                position: "relative",
                cursor: "pointer",
                fontFamily: "'Padauk', sans-serif",
                color: "white",
                minHeight: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                userSelect: "none",
            }}
        >


            {/* Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>

            {/* Text Content */}
            <p style={{
                margin: 0,
                fontSize: "1.2rem",
                lineHeight: "1.8",
                textShadow: "2px 2px 0 #000"
            }}>
                {displayedText}
                {isTyping && <span style={{
                    display: "inline-block",
                    width: "10px",
                    height: "20px",
                    background: "white",
                    marginLeft: "5px",
                    verticalAlign: "middle",
                    animation: "blink 1s step-end infinite"
                }} />}
            </p>

            {/* Next Arrow */}
            {!isTyping && (
                <div style={{
                    alignSelf: "flex-end",
                    marginTop: "10px",
                    animation: "blink 1s step-end infinite",
                    fontSize: "1.5rem",
                    color: "#FFd700"
                }}>
                    ▼
                </div>
            )}
        </div>
    );
}
