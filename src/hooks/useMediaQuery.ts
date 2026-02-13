import { useState, useEffect } from "react";

/**
 * Returns true when viewport width is >= the given breakpoint (min-width in px).
 * Use for switching between card layout (false) and table layout (true).
 * Defaults to false (cards) to avoid hydration mismatch and flash on mobile.
 */
export function useMediaQuery(minWidthPx: number): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [minWidthPx]);

  return matches;
}
