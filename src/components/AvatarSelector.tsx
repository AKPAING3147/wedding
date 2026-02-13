"use client";

import Image from "next/image";

// Define available avatars - using placeholders or simple colors for now if images aren't ready
// Ideally, we would have /pixel-cat.png, /pixel-dog.png, etc.
// For now, I will generate some data URLs or use colored pixel blocks as placeholders
// or use existing assets if available.
// I'll use simple colored 8-bit style blocks with emojis for now until real assets are added.

const AVATARS = [
    { id: "cat", label: "Cat", color: "#FFB060", icon: "🐱" },
    { id: "dog", label: "Dog", color: "#A0522D", icon: "🐶" },
    { id: "bird", label: "Bird", color: "#87CEEB", icon: "🐦" },
    { id: "bear", label: "Bear", color: "#8B4513", icon: "🐻" },
    { id: "rabbit", label: "Rabbit", color: "#FFC0CB", icon: "🐰" },
    { id: "frog", label: "Frog", color: "#32CD32", icon: "🐸" },
];

interface AvatarSelectorProps {
    selectedAvatar: string;
    onSelect: (id: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
    return (
        <div style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px"
        }}>
            {AVATARS.map((avatar) => (
                <div
                    key={avatar.id}
                    onClick={() => onSelect(avatar.id)}
                    style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: avatar.color,
                        border: selectedAvatar === avatar.id ? "4px solid #FFD700" : "4px solid white",
                        boxShadow: selectedAvatar === avatar.id
                            ? "0 0 10px #FFD700, 4px 4px 0 rgba(0,0,0,0.5)"
                            : "4px 4px 0 rgba(0,0,0,0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        transform: selectedAvatar === avatar.id ? "scale(1.1) translateY(-5px)" : "scale(1)",
                        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        imageRendering: "pixelated"
                    }}
                    title={avatar.label}
                >
                    {avatar.icon}
                </div>
            ))}
        </div>
    );
}
