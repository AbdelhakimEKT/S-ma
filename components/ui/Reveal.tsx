'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  /** Pixels of translation before reveal. */
  y?: number
  /** Blur in pixels before reveal. */
  blur?: number
  delay?: number
  duration?: number
  once?: boolean
  className?: string
  /** For text/lines reveal instead of blocks. */
  as?: 'div' | 'span' | 'section' | 'article' | 'li' | 'h2' | 'h3' | 'p'
}

/**
 * A calm reveal primitive.
 *
 * - Honors `prefers-reduced-motion` — returns a static element in that case.
 * - Defaults tuned long (900 ms) and soft-eased so even a wall of reveals
 *   never feels busy.
 */
export function Reveal({
  children,
  y = 28,
  blur = 6,
  delay = 0,
  duration = 0.9,
  once = true,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    const Tag = as as any
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = (motion as any)[as]

  const variants: Variants = {
    hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration, ease: ease.out, delay },
    },
  }

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: '-10% 0px -10% 0px' }}
      variants={variants}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Reveal-group: staggers its direct children.
 * Put a `<Reveal>` per child for full control, or use this for quick sequences.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  stagger?: number
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '-10% 0px -10% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
