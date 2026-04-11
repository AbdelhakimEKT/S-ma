'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Slow, infinite horizontal marquee used for the rituals ribbon.
 * Duplicates children once so the loop is seamless.
 */
export default function Marquee({
  children,
  duration = 50,
  direction = 'left',
  className,
}: {
  children: React.ReactNode
  duration?: number
  direction?: 'left' | 'right'
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <div className={cn('relative flex w-full overflow-hidden', className)}>
      <motion.div
        className="flex min-w-full shrink-0 items-center gap-16 whitespace-nowrap pr-16"
        animate={
          reduce
            ? {}
            : { x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'] }
        }
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="flex min-w-full shrink-0 items-center gap-16 whitespace-nowrap pr-16"
        animate={
          reduce
            ? {}
            : { x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'] }
        }
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
