import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import LightRays from "@/components/LightRays";
import "./globals.css";
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The hub for developers to discover and share events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 -z-10">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.8}
            lightSpread={0.7}
            rayLength={8}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0.0}
            distortion={0.01}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
