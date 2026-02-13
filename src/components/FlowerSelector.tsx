"use client";

// Simple pixel art flower representations using emojis or colored blocks for now.
// In a real scenario, these would be Image components pointing to pixel art assets.

const FLOWERS = [
    { id: "rose", label: "Rose", color: "#e74c3c", icon: "🌹" },
    { id: "sunflower", label: "Sunflower", color: "#f1c40f", icon: "🌻" },
    { id: "tulip", label: "Tulip", color: "#9b59b6", icon: "🌷" },
    { id: "daisy", label: "Daisy", color: "#ecf0f1", icon: "🌼" },
    { id: "orchid", label: "Orchid", color: "#d35400", icon: "🌺" },
    { id: "mushroom", label: "Mushroom", color: "#e67e22", icon: "🍄" },
];

interface FlowerSelectorProps {
    selectedFlower: string;
    onSelect: (id: string) => void;
}

export default function FlowerSelector({ selectedFlower, onSelect }: FlowerSelectorProps) {
    return (
        <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px"
        }}>
            {FLOWERS.map((flower) => (
                <div
                    key={flower.id}
                    onClick={() => onSelect(flower.id)}
                    style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: selectedFlower === flower.id ? "#fff" : "rgba(255,255,255,0.5)",
                        border: selectedFlower === flower.id ? `3px solid ${flower.color}` : "3px solid transparent",
                        borderRadius: "50%", // Circle for organic feel
                        boxShadow: selectedFlower === flower.id
                            ? `0 0 10px ${flower.color}, 2px 2px 0 rgba(0,0,0,0.2)`
                            : "none",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.8rem",
                        cursor: "pointer",
                        transform: selectedFlower === flower.id ? "scale(1.2) translateY(-5px)" : "scale(1)",
                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        imageRendering: "pixelated"
                    }}
                    title={flower.label}
                >
                    {flower.icon}
                </div>
            ))}
        </div>
    );
}
