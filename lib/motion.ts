import type { Variants, Transition } from 'framer-motion'

/**
 * Motion tokens shared across the project.
 * Easings here mirror the Tailwind config so that CSS and JS animations
 * breathe on the same rhythm. Durations lean long on purpose — Söma is slow.
 */

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
}

export const durations = {
  micro: 0.22,
  base: 0.6,
  long: 0.9,
  narrative: 1.2,
} as const

export const transitions = {
  base: { duration: durations.base, ease: ease.out } satisfies Transition,
  long: { duration: durations.long, ease: ease.out } satisfies Transition,
  narrative: { duration: durations.narrative, ease: ease.out } satisfies Transition,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: transitions.long,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.long },
}

export const stagger = (delay = 0, gap = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: gap,
    },
  },
})

export const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: ease.out },
  },
}

export const softScale: Variants = {
  hidden: { opacity: 0, scale: 1.06, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: ease.out },
  },
}

/** Viewport defaults — start a touch early, run once. */
export const viewport = { once: true, amount: 0.25, margin: '-10% 0px -10% 0px' }
