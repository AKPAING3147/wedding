"use client";

import React, { useEffect, useState } from 'react';

interface PixelSpriteProps {
    src: string;
    frameWidth: number;
    frameHeight: number;
    frameCount: number; // Number of frames in the animation row
    row?: number;       // Which row of the sprite sheet to use (0-indexed)
    fps?: number;       // Frames per second
    scale?: number;     // Scale factor for pixel art
    loop?: boolean;     // Loop animation
    autoplay?: boolean; // Start automatically
    className?: string; // Custom class
    style?: React.CSSProperties; // Custom styles
}

const PixelSprite: React.FC<PixelSpriteProps> = ({
    src,
    frameWidth,
    frameHeight,
    frameCount,
    row = 0,
    fps = 10,
    scale = 1,
    loop = true,
    autoplay = true,
    className,
    style,
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    useEffect(() => {
        if (!autoplay) return;

        let animationFrameId: number;
        let lastTime = performance.now();
        const interval = 1000 / fps;

        const animate = (time: number) => {
            const deltaTime = time - lastTime;

            if (deltaTime >= interval) {
                setCurrentFrame((prev) => {
                    const next = prev + 1;
                    if (next >= frameCount) {
                        return loop ? 0 : prev;
                    }
                    return next;
                });
                lastTime = time - (deltaTime % interval);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [fps, frameCount, loop, autoplay]);

    return (
        <div
            className={className}
            style={{
                width: frameWidth * scale,
                height: frameHeight * scale,
                overflow: 'hidden',
                display: 'inline-block',
                imageRendering: 'pixelated', // Essential for pixel art
                position: 'relative',
                ...style,
            }}
        >
            <div
                style={{
                    width: frameWidth,
                    height: frameHeight,
                    backgroundImage: `url('${src}')`,
                    backgroundPosition: `-${currentFrame * frameWidth}px -${row * frameHeight}px`,
                    backgroundRepeat: 'no-repeat',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            />
        </div>
    );
};

export default PixelSprite;
