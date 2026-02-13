"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Helper to get avatar details from ID
const AVATARS: Record<string, { color: string, icon: string }> = {
    cat: { color: "#FFB060", icon: "🐱" },
    dog: { color: "#A0522D", icon: "🐶" },
    bird: { color: "#87CEEB", icon: "🐦" },
    bear: { color: "#8B4513", icon: "🐻" },
    rabbit: { color: "#FFC0CB", icon: "🐰" },
    frog: { color: "#32CD32", icon: "🐸" },
};

interface Wish {
    id: number;
    name: string;
    message: string;
    avatar_id: string; // New field
}

export default function PixelCrowd() {
    const [wishes, setWishes] = useState<Wish[]>([]);

    useEffect(() => {
        // Info: Initial fetch
        fetchWishes();

        // Subscribe to changes
        const channel = supabase
            .channel('pixel-crowd-updates')
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
            .order('id', { ascending: false }) // Newest first
            .limit(50); // Limit crowd size for performance

        if (!error && data) {
            setWishes(data);
        }
    };

    return (
        <div style={{
            width: "100%",
            padding: "40px 20px",
            backgroundColor: "#2c3e50", // Ground color
            borderTop: "10px solid #27ae60", // Grass line
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            minHeight: "300px",
            position: "relative",
        }}>
            <h2 style={{
                width: "100%",
                textAlign: "center",
                color: "white",
                fontFamily: "'Press Start 2P', system-ui",
                marginBottom: "30px",
                textShadow: "4px 4px 0 #000"
            }}>
                GUEST CROWD
            </h2>

            {wishes.map((wish) => {
                const avatar = AVATARS[wish.avatar_id] || AVATARS["cat"]; // Fallback

                return (
                    <div
                        key={wish.id}
                        className="crowd-member"
                        style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            margin: "10px",
                            cursor: "pointer",
                        }}
                    >
                        {/* Tooltip/Bubble (Hidden by default, shown on hover via CSS) */}
                        <div className="message-bubble" style={{
                            position: "absolute",
                            bottom: "110%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "white",
                            padding: "10px",
                            borderRadius: "8px",
                            width: "150px",
                            border: "2px solid #000",
                            boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
                            zIndex: 10,
                            textAlign: "center",
                            fontSize: "0.8rem",
                            fontFamily: "'Courier New', monospace",
                            fontWeight: "bold",
                            opacity: 0, // Controlled by CSS
                            pointerEvents: "none",
                            transition: "opacity 0.2s"
                        }}>
                            <div style={{ color: avatar.color, textTransform: "uppercase", marginBottom: "4px" }}>{wish.name}</div>
                            <div>{wish.message}</div>
                            {/* Arrow */}
                            <div style={{
                                position: "absolute",
                                bottom: "-6px",
                                left: "50%",
                                marginLeft: "-6px",
                                width: "0",
                                height: "0",
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "6px solid #000",
                            }}></div>
                        </div>

                        {/* Avatar Sprite */}
                        <div style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: avatar.color,
                            border: "3px solid white",
                            boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "1.2rem",
                            animation: `bounce ${2 + Math.random()}s infinite ease-in-out` // Randomized bounce speed
                        }}>
                            {avatar.icon}
                        </div>
                        {/* Simple Name Tag under avatar */}
                        <div style={{
                            marginTop: "5px",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            padding: "2px 6px",
                            fontSize: "0.6rem",
                            borderRadius: "4px",
                            opacity: 0.8
                        }}>
                            {wish.name}
                        </div>

                    </div>
                );
            })}

            <style jsx>{`
        .crowd-member:hover .message-bubble {
            opacity: 1 !important;
            top: -100px; /* Adjust based on height */
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
}
