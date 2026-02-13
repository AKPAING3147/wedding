"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Helper to get flower details
const FLOWERS: Record<string, { color: string, icon: string }> = {
    rose: { color: "#e74c3c", icon: "🌹" },
    sunflower: { color: "#f1c40f", icon: "🌻" },
    tulip: { color: "#9b59b6", icon: "🌷" },
    daisy: { color: "#ecf0f1", icon: "🌼" },
    orchid: { color: "#d35400", icon: "🌺" },
    mushroom: { color: "#e67e22", icon: "🍄" },
    // Fallbacks
    cat: { color: "#95a5a6", icon: "🐱" }, // Legacy support if needed
};

interface Wish {
    id: number;
    name: string;
    message: string;
    avatar_id: string; // Storing flower type here
}

export default function PixelGarden() {
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        fetchWishes();

        const channel = supabase
            .channel('pixel-garden-updates')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
                setWishes(prev => [payload.new as Wish, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchWishes = async () => {
        const { data, error } = await supabase
            .from('wishes')
            .select('*')
            .order('id', { ascending: false })
            .limit(60); // A full garden

        if (!error && data) {
            setWishes(data);
        }
    };

    // Generate some random grass tufts for decoration
    const [grassTufts, setGrassTufts] = useState<{ left: number, top: number, type: number }[]>([]);

    useEffect(() => {
        // Client-side only random generation to match hydration
        const tufts = Array.from({ length: 20 }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            type: Math.floor(Math.random() * 3)
        }));
        setGrassTufts(tufts);
    }, []);

    return (
        <div style={{
            width: "100%",
            borderRadius: "20px", // Match plant box
            backgroundColor: "#2ecc71", // Base Green
            position: "relative",
            padding: "60px 20px 40px 20px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            boxSizing: "border-box" // Fix width calculation
        }}>

            {/* Decorative Grass Background Pattern */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, width: "100%", height: "100%",
                opacity: 0.3,
                pointerEvents: "none",
                backgroundImage: `radial-gradient(#27ae60 15%, transparent 16%)`,
                backgroundSize: "20px 20px"
            }} />

            {/* Random Grass Tufts */}
            {grassTufts.map((tuft, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: `${tuft.left}%`,
                    top: `${tuft.top}%`,
                    fontSize: "10px",
                    color: "#27ae60",
                    pointerEvents: "none",
                    userSelect: "none",
                    opacity: 0.6
                }}>
                    {tuft.type === 0 ? "wm" : tuft.type === 1 ? "v v" : "w"}
                </div>
            ))}

            {/* Header Sign */}
            <div style={{
                backgroundColor: "#f1c40f", // Gold/Wood color
                border: "4px solid #d35400",
                padding: "15px 30px",
                borderRadius: "8px",
                marginBottom: "40px",
                boxShadow: "0 8px 0 rgba(0,0,0,0.2), 0 8px 0 #d35400",
                transform: "rotate(-2deg)",
                zIndex: 10,
                position: "relative"
            }}>
                {/* Nails */}
                <div style={{ position: "absolute", top: "5px", left: "5px", width: "6px", height: "6px", backgroundColor: "#d35400", borderRadius: "50%" }} />
                <div style={{ position: "absolute", top: "5px", right: "5px", width: "6px", height: "6px", backgroundColor: "#d35400", borderRadius: "50%" }} />

                <h2 style={{
                    margin: 0,
                    fontSize: "1.2rem",
                    color: "#8e44ad",
                    fontFamily: "'Press Start 2P', system-ui",
                    textShadow: "2px 2px 0 #fff",
                    textAlign: "center"
                }}>
                    OUR LOVE GARDEN
                </h2>
            </div>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "20px",
                width: "100%",
                maxWidth: "1000px",
                zIndex: 5
            }}>
                {wishes.length === 0 && (
                    <div style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "1.2rem",
                        color: "rgba(0,0,0,0.4)",
                        marginTop: "50px",
                        fontWeight: "bold"
                    }}>
                        Be the first to plant a flower! 🌱
                    </div>
                )}

                {wishes.map((wish, index) => {
                    const flower = FLOWERS[wish.avatar_id] || FLOWERS["rose"];

                    return (
                        <div
                            key={wish.id}
                            className="flower-item"
                            style={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                margin: "10px",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                zIndex: index // Stack nicely
                            }}
                        >


                            {/* Flower Icon */}
                            <div style={{
                                fontSize: "3rem",
                                filter: "drop-shadow(0 5px 0 rgba(0,0,0,0.1))",
                                animation: `sway ${3 + (index % 3)}s infinite ease-in-out`,
                                transformOrigin: "bottom center"
                            }}>
                                {flower.icon}
                            </div>

                            {/* Dirt Patch */}
                            <div style={{
                                width: "20px",
                                height: "6px",
                                backgroundColor: "#5d4037",
                                borderRadius: "50%",
                                opacity: 0.6,
                                marginTop: "-4px"
                            }}></div>
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .flower-item:hover {
            z-index: 100 !important;
            transform: scale(1.15) translateY(-5px);
        }

        @keyframes sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
      `}</style>

        </div>
    );
}
