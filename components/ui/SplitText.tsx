'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SplitTextProps {
  text: string
  /** `word` reveals whole words; `line` expects multiline text and splits on `\n`. */
  by?: 'word' | 'line'
  className?: string
  /** Stagger between words/lines. */
  stagger?: number
  delay?: number
  duration?: number
  /** Hold the tag we render as (h1/h2/p). */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

/**
 * Reveals text in chunks with a slight per-chunk delay, clipped by an
 * `overflow-hidden` mask so it looks like the words lift from a line.
 *
 * - Spaces are preserved as separate elements for correct kerning.
 * - Reduced motion: returns the plain text, same tag, no animation.
 */
export default function SplitText({
  text,
  by = 'word',
  className,
  stagger = 0.045,
  delay = 0,
  duration = 1,
  as: Tag = 'span',
}: SplitTextProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <Tag className={className}>{text}</Tag>
  }

  const chunks = by === 'word' ? text.split(' ') : text.split('\n')

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
  }

  const item: Variants = {
    hidden: { y: '115%' },
    visible: {
      y: '0%',
      transition: { duration, ease: ease.out },
    },
  }

  const MotionTag = (motion as any)[Tag]

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={container}
      aria-label={text}
    >
      {chunks.map((chunk, i) => (
        <span
          key={`${chunk}-${i}`}
          className="inline-block overflow-hidden align-baseline"
          aria-hidden
        >
          <motion.span variants={item} className="inline-block will-change-transform">
            {chunk}
            {by === 'word' && i < chunks.length - 1 ? '\u00A0' : ''}
          </motion.span>
          {by === 'line' && i < chunks.length - 1 && <br />}
        </span>
      ))}
    </MotionTag>
  )
}
