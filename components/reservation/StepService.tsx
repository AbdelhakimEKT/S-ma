'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useReservation, nextStep } from './ReservationContext'
import { rituals } from '@/data/rituals'
import { formatDuration, formatPrice, cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'

/**
 * Step 1 — choose the ritual.
 *
 * Cards are radio-like (one selectable at a time). Selection animates a
 * subtle ember ring + a check mark in the top-right corner.
 */
export default function StepService() {
  const { draft, dispatch } = useReservation()

  function select(slug: string) {
    dispatch({ type: 'set-ritual', slug })
  }

  function continueNext() {
    if (draft.ritualSlug) dispatch({ type: 'go-to', step: nextStep('service') })
  }

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-bone-500">Étape 01 — Le rituel</p>
        <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
          Quel rituel souhaitez-vous offrir au temps ?
        </h2>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {rituals.map((r, i) => {
          const selected = draft.ritualSlug === r.slug
          return (
            <motion.button
              key={r.slug}
              type="button"
              onClick={() => select(r.slug)}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: ease.out, delay: i * 0.05 }}
              className={cn(
                'group relative overflow-hidden rounded-sm border p-5 text-left transition-all duration-600 ease-soma',
                selected
                  ? 'border-ember-500/70 bg-ember-500/[0.06] shadow-[0_0_50px_-20px_rgba(220,176,132,0.4)]'
                  : 'border-[var(--line)] bg-bone-100/[0.015] hover:border-bone-400/30',
              )}
            >
              <div className="flex gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={r.image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.06]"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-xl text-bone-100">{r.name}</h3>
                    <span className="font-serif text-base text-bone-200">
                      {formatPrice(r.price)}
                      {r.perGroup && <span className="ml-1 text-[10px] text-bone-500">/grp</span>}
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] text-bone-400">{r.tagline}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] uppercase tracking-wide-1 text-bone-500">
                    <span>{r.category}</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <span>{formatDuration(r.duration)}</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <span>jusqu'à {r.maxGuests}</span>
                  </div>
                </div>
              </div>

              {/* Selected mark */}
              <motion.div
                initial={false}
                animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-ember-500 text-ink-900"
                aria-hidden
              >
                <svg viewBox="0 0 16 16" width={10} height={10} fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.button>
          )
        })}
      </div>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-bone-500">
          Vous changerez d'avis ? Vous pourrez modifier votre rituel à l'étape suivante.
        </p>
        <Button
          variant="primary"
          onClick={continueNext}
          disabled={!draft.ritualSlug}
          dot
        >
          Continuer
        </Button>
      </footer>
    </div>
  )
}
