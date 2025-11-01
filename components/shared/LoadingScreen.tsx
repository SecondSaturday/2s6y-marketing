"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  progress: number; // 0-100
  isVisible: boolean;
  onTransitionEnd?: () => void;
}

export default function LoadingScreen({
  progress,
  isVisible,
  onTransitionEnd,
}: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      // Wait for fade out animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
        onTransitionEnd?.();
      }, 500); // Match fade duration

      return () => clearTimeout(timer);
    }
  }, [isVisible, onTransitionEnd]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base-300 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Lightweight Logo */}
      <div className="flex flex-col items-center gap-8 w-full max-w-md px-4">
        <Image
          src="/2s6y/favicon.svg"
          alt="2s6y Logo"
          width={80}
          height={80}
          className="w-20 h-20"
          priority
        />

        {/* Horizontal Progress Bar */}
        <div className="w-full flex flex-col gap-2">
          {/* Progress Bar Track */}
          <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
            {/* Progress Bar Fill */}
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage Indicator */}
          <div className="text-center">
            <span className="text-base text-base-content/70 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
