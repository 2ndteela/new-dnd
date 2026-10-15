import { useState, useEffect } from 'react'

// Keep in sync with the media queries in CSS (docs/style-guide.md → Layout → Breakpoints)
export const SMALL_PHONE_MAX = 480
export const DESKTOP_MIN = 1024
export const WIDE_MIN = 1200

export const DESKTOP_QUERY = `(min-width: ${DESKTOP_MIN}px)`

// One-off check for code that only reads the width once (e.g. initial layout)
export const isDesktopWidth = () => window.innerWidth >= DESKTOP_MIN

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY)
