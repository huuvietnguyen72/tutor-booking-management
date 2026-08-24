"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface AuthContainerProps {
  children: React.ReactNode;
  className?: string;
}

const BACKGROUND_BLOBS = [
  "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob",
  "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-blob [animation-delay:2s]",
  "absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] animate-blob [animation-delay:4s]",
] as const;

const GRID_PATTERN_STYLE = {
  backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
  backgroundSize: "32px 32px",
} as const;

const NOISE_PATTERN_STYLE = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
} as const;

export const AuthContainer = React.memo(function AuthContainer({ children, className }: AuthContainerProps) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background transition-colors duration-500">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-auth-bg-from via-auth-bg-via to-auth-bg-to transition-colors duration-500" />

        {/* Animated Blobs */}
        {BACKGROUND_BLOBS.map((blobClassName) => (
          <div key={blobClassName} className={blobClassName} />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={GRID_PATTERN_STYLE}
      />

      {/* Subtle Grain Texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.3] pointer-events-none mix-blend-overlay"
        style={NOISE_PATTERN_STYLE}
      />

      {/* Card Container */}
      <div className={cn(
        "w-full max-w-120 bg-card/80 dark:bg-card/70 rounded-4xl shadow-2xl shadow-blue-900/10 dark:shadow-black/40 border border-border p-8 md:p-12 relative z-10 backdrop-blur-xl animate-in fade-in zoom-in duration-500 ease-out",
        className
      )}>
        {children}
      </div>
    </main>
  );
});

AuthContainer.displayName = "AuthContainer";
