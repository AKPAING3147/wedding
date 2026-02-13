import type { Metadata } from "next";
// import { Press_Start_2P } from "next/font/google"; // Next.js font optimization not working in this environment for some reason?
import "@fontsource/press-start-2p"; // Using direct import instead
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Pixel Wedding",
  description: "A pixel art themed wedding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Press Start 2P", system-ui' }}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
