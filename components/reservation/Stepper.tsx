'use client'

import { motion } from 'framer-motion'
import { STEPS, useReservation } from './ReservationContext'
import { cn } from '@/lib/utils'

/**
 * Horizontal step indicator. Compact, typographic, with a smooth ember
 * progress bar that fills up as steps are completed.
 */
export default function Stepper() {
  const { step } = useReservation()
  const currentIndex = STEPS.findIndex((s) => s.id === step)
  const visibleSteps = STEPS.filter((s) => s.id !== 'success')
  const progress = currentIndex === -1 ? 0 : Math.min(currentIndex, visibleSteps.length - 1) / (visibleSteps.length - 1)

  if (step === 'success') return null

  return (
    <div className="relative w-full">
      {/* Progress rail */}
      <div className="relative h-px w-full bg-[var(--line)]">
        <motion.div
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left center' }}
          className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-ember-500/0 via-ember-500/80 to-ember-500"
        />
      </div>

      {/* Labels */}
      <ol className="mt-6 grid grid-cols-5 gap-2 text-[11px] uppercase tracking-wide-1">
        {visibleSteps.map((s, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <li key={s.id} className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border text-[9px] transition-all duration-600 ease-soma',
                    active && 'border-ember-500 bg-ember-500/10 text-ember-500',
                    done && 'border-ember-500/60 bg-ember-500/20 text-bone-100',
                    !active && !done && 'border-[var(--line-strong)] text-bone-500',
                  )}
                >
                  {done ? '✓' : s.index}
                </span>
                <span
                  className={cn(
                    'transition-colors duration-600 hidden md:inline',
                    active ? 'text-bone-100' : done ? 'text-bone-300' : 'text-bone-500',
                  )}
                >
                  {s.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
