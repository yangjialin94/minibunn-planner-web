/**
 * Custom React Hook for Media Queries
 * This hook allows you to check if a specific media query matches the current viewport.
 * Created with Gemini AI
 */

"use client"; // This ensures the hook runs only on the client-side in Next.js App Router

import { useEffect, useState } from "react";

// Define Tailwind breakpoints in JavaScript for consistency
const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Custom hook to check if a CSS media query matches.
 * Useful for responsive logic in JavaScript.
 * @param query The media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize state based on if window is available (for SSR safety)
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    // Default to false or whatever makes sense for your SSR content
    // If your component needs to render differently based on default, be consistent
    return false;
  });

  useEffect(() => {
    // This effect runs only on the client after hydration
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Update state with initial match
    setMatches(mediaQueryList.matches);

    // Listener function for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQueryList.addEventListener("change", listener);

    // Clean up
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]); // Re-run if the query string itself changes (unlikely for fixed breakpoints)

  return matches;
};

/**
 * Custom hook to check if the current screen size is 'md' or larger (>= 768px).
 */
export const useIsMd = () =>
  useMediaQuery(`(min-width: ${tailwindBreakpoints.md}px)`);

/**
 * Custom hook to check if the current screen size is 'lg' or larger (>= 1024px).
 */
export const useIsLg = () =>
  useMediaQuery(`(min-width: ${tailwindBreakpoints.lg}px)`);

// You can add more specific hooks for other breakpoints as needed.
