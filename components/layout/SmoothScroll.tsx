'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scroll wrapper built on Lenis.
 *
 * - Respects `prefers-reduced-motion`.
 * - Syncs RAF with the browser's frame loop instead of setInterval.
 * - Cleans up on unmount.
 *
 * This is deliberately a client-only wrapper, mounted once at the root layout.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.25,
      // Long, soft ease — pairs with the rest of the motion system.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
    })

    // Hook Lenis into the browser frame loop.
    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
