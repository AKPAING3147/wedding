import type { Metadata, Viewport } from "next";
// import { Press_Start_2P } from "next/font/google"; // Next.js font optimization not working in this environment for some reason?
import "@fontsource/press-start-2p"; // Using direct import instead
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "Pixel Wedding",
  description: "A pixel art themed wedding website",
};

// Viewport removed to revert to old version

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: '"Press Start 2P", "Padauk", system-ui' }}>
        <LoadingScreen />
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}
