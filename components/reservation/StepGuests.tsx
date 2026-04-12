'use client'

import { motion } from 'framer-motion'
import { useReservation, nextStep, prevStep } from './ReservationContext'
import { getRitualBySlug } from '@/data/rituals'
import { computeTotal } from '@/lib/reservation'
import { formatPrice, cn } from '@/lib/utils'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'

/**
 * Step 3 — number of guests.
 *
 * Big stepper, capped by `ritual.maxGuests`. Live total recompute.
 */
export default function StepGuests() {
  const { draft, dispatch, resumeToRecap } = useReservation()
  const ritual = draft.ritualSlug ? getRitualBySlug(draft.ritualSlug) : undefined
  if (!ritual) return null

  const max = ritual.maxGuests
  const total = computeTotal(ritual, draft.guests)

  function set(g: number) {
    if (g < 1 || g > max) return
    dispatch({ type: 'set-guests', guests: g })
  }

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-bone-500">Étape 03 — Personnes</p>
        <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
          Vous serez combien à venir ?
        </h2>
        <p className="mt-3 text-[14.5px] text-bone-400">
          Ce rituel accueille jusqu'à {max} personne{max > 1 ? 's' : ''}.
          {ritual.perGroup && ' Le tarif est forfaitaire pour le groupe.'}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Stepper */}
        <div className="surface rounded-sm p-10 text-center">
          <p className="eyebrow mb-6 text-bone-500">Nombre de personnes</p>
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => set(draft.guests - 1)}
              disabled={draft.guests <= 1}
              aria-label="Moins une personne"
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-600 ease-soma',
                draft.guests <= 1
                  ? 'cursor-not-allowed border-[var(--line)] text-bone-500/40'
                  : 'border-[var(--line-strong)] text-bone-200 hover:border-ember-500/60 hover:text-ember-500',
              )}
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <motion.div
              key={draft.guests}
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: ease.out }}
              className="font-serif text-7xl text-bone-100 tabular-nums w-24"
            >
              {draft.guests}
            </motion.div>
            <button
              type="button"
              onClick={() => set(draft.guests + 1)}
              disabled={draft.guests >= max}
              aria-label="Une personne de plus"
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-600 ease-soma',
                draft.guests >= max
                  ? 'cursor-not-allowed border-[var(--line)] text-bone-500/40'
                  : 'border-[var(--line-strong)] text-bone-200 hover:border-ember-500/60 hover:text-ember-500',
              )}
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <p className="mt-6 text-[13px] text-bone-500">
            {draft.guests === 1 ? 'Une visite en solo, donc.' : `Vous serez ${draft.guests}.`}
          </p>
        </div>

        {/* Live total */}
        <div className="surface-warm rounded-sm p-10">
          <p className="eyebrow mb-6 text-ember-400">Aperçu du tarif</p>
          <div className="space-y-3 text-[14px] text-bone-300">
            <div className="flex items-baseline justify-between">
              <span>{ritual.name}</span>
              <span className="font-serif text-base">{formatPrice(ritual.price)}</span>
            </div>
            {!ritual.perGroup && (
              <div className="flex items-baseline justify-between text-bone-400">
                <span>× {draft.guests} personne{draft.guests > 1 ? 's' : ''}</span>
                <span className="font-serif text-base">
                  {formatPrice(ritual.price * draft.guests)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-ember-500/20 pt-6">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-bone-500">Total estimé</span>
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="font-serif text-4xl text-bone-100"
              >
                {formatPrice(total)}
              </motion.span>
            </div>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-bone-500">
            Un acompte de 30 % sera demandé à l'étape suivante pour confirmer la réservation.
            Le solde reste réglé sur place, au moment de votre venue. Annulation gratuite jusqu'à 48h avant.
          </p>
        </div>
      </div>

      <footer className="mt-12 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : prevStep('guests') })}
        >
          ← Retour
        </Button>
        <Button
          variant="primary"
          onClick={() => dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : nextStep('guests') })}
          dot
        >
          Continuer
        </Button>
      </footer>
    </div>
  )
}
