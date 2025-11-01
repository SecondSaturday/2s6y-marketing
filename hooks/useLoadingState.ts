"use client";

import { useEffect, useState } from "react";

interface UseLoadingStateOptions {
  /**
   * Minimum time to show loading screen (in ms)
   * Prevents flash if assets load too quickly
   * @default 1000
   */
  minDisplayTime?: number;

  /**
   * Maximum time to show loading screen (in ms)
   * Forces removal even if assets haven't loaded
   * @default 5000
   */
  maxDisplayTime?: number;
}

interface UseLoadingStateReturn {
  /** Whether the loading screen should be visible */
  isLoading: boolean;
  /** Current loading progress (0-100) */
  progress: number;
  /** Whether this is the user's first visit */
  isFirstVisit: boolean;
}

/**
 * Hook to manage loading state for pages with heavy assets
 * Only shows loading screen when resources are actually loading
 * Tracks first-time visitors and applies longer display time
 */
export function useLoadingState(
  options: UseLoadingStateOptions = {}
): UseLoadingStateReturn {
  const { minDisplayTime, maxDisplayTime = 5000 } = options;

  // Track if component has hydrated (prevents hydration mismatch)
  const [isHydrated, setIsHydrated] = useState(false);

  // Check first-visit status - start as false to match server render
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // For returning users, start with loading complete
  // For first-time users, start with loading active
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(100);
  const [fontsLoaded, setFontsLoaded] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(true);

  // Check localStorage after hydration to avoid mismatch
  useEffect(() => {
    setIsHydrated(true);
    const hasVisited = localStorage.getItem("2s6y_visited");
    const firstVisit = !hasVisited;
    setIsFirstVisit(firstVisit);

    // Update initial states for first-time visitors
    if (firstVisit) {
      setIsLoading(true);
      setProgress(0);
      setFontsLoaded(false);
      setMinTimeElapsed(false);
      setImagesLoaded(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip loading logic until hydrated
    if (!isHydrated) {
      return;
    }

    // Skip loading logic for returning users
    if (!isFirstVisit) {
      return;
    }

    // Minimum display time: 1 second for first-time visitors
    const actualMinTime = 1000;

    // Track minimum display time
    let minTimer: NodeJS.Timeout | undefined;
    if (actualMinTime > 0) {
      minTimer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, actualMinTime);
    } else {
      setMinTimeElapsed(true);
    }

    // Track fonts loading
    document.fonts.ready
      .then(() => {
        setFontsLoaded(true);
        setProgress((prev) => Math.max(prev, 50));
      })
      .catch((error) => {
        console.warn("Font loading failed:", error);
        setFontsLoaded(true);
        setProgress((prev) => Math.max(prev, 50));
      });

    // Track images loading
    const checkImages = () => {
      const allImages = document.querySelectorAll("img");

      if (allImages.length === 0) {
        // No images yet, keep checking
        return false;
      }

      const allComplete = Array.from(allImages).every(
        (img) => (img as HTMLImageElement).complete
      );

      if (allComplete) {
        setImagesLoaded(true);
        setProgress((prev) => Math.max(prev, 100));
        return true;
      }
      return false;
    };

    // Check images immediately and set up polling
    if (!checkImages()) {
      const imageCheckInterval = setInterval(() => {
        if (checkImages()) {
          clearInterval(imageCheckInterval);
        }
      }, 100);

      // Store interval for cleanup
      const maxTimer = setTimeout(() => {
        setMinTimeElapsed(true);
        setFontsLoaded(true);
        setImagesLoaded(true);
        setProgress(100);
      }, maxDisplayTime);

      // Cleanup
      return () => {
        if (minTimer) clearTimeout(minTimer);
        clearTimeout(maxTimer);
        clearInterval(imageCheckInterval);
      };
    }

    // Cleanup if images already loaded
    return () => {
      if (minTimer) clearTimeout(minTimer);
    };
  }, [minDisplayTime, maxDisplayTime, isHydrated, isFirstVisit]);

  // Update loading state when all conditions are met
  useEffect(() => {
    if (minTimeElapsed && fontsLoaded && imagesLoaded) {
      setProgress(100);
      // Small delay to show 100% before hiding
      const hideTimer = setTimeout(() => {
        setIsLoading(false);
        // Set visited flag AFTER loading completes
        if (typeof window !== "undefined" && isFirstVisit) {
          localStorage.setItem("2s6y_visited", "true");
        }
      }, 200);

      return () => clearTimeout(hideTimer);
    }
  }, [minTimeElapsed, fontsLoaded, imagesLoaded, isFirstVisit]);

  return {
    isLoading,
    progress,
    isFirstVisit,
  };
}
