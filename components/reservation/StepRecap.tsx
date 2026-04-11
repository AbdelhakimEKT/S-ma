'use client'

import { motion } from 'framer-motion'
import { useReservation, prevStep } from './ReservationContext'
import { getRitualBySlug } from '@/data/rituals'
import { computeTotal, computeDeposit } from '@/lib/reservation'
import { formatDateLong, formatPrice, formatDuration } from '@/lib/utils'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'

/**
 * Step 5 — récapitulatif & déclenchement du paiement Stripe.
 *
 * Flow :
 *   1. POST /api/reservations  → crée la ligne en DB (pending_payment)
 *   2. POST /api/checkout      → crée la session Stripe Checkout
 *   3. window.location.href = url  → redirige vers Stripe
 *
 * En cas d'annulation sur Stripe, l'utilisateur revient sur /reservation.
 * En cas de succès, il atterrit sur /reservation/confirmation.
 */
export default function StepRecap() {
  const { draft, dispatch, submitting, error } = useReservation()
  const ritual = draft.ritualSlug ? getRitualBySlug(draft.ritualSlug) : undefined

  if (!ritual || !draft.date || !draft.time) return null

  const total   = computeTotal(ritual, draft.guests)
  const deposit = computeDeposit(total)
  const date    = new Date(draft.date)

  async function handlePayment() {
    dispatch({ type: 'submitting' })

    try {
      // 1. Créer la réservation en base
      const resRes = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })

      if (!resRes.ok) {
        const err = await resRes.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Erreur lors de l\'enregistrement.')
      }

      const { id: reservationId } = (await resRes.json()) as { id: string }

      // 2. Créer la session Stripe Checkout
      const chkRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      })

      if (!chkRes.ok) {
        const err = await chkRes.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Erreur lors du paiement.')
      }

      const { url } = (await chkRes.json()) as { url: string }

      // 3. Rediriger vers Stripe Checkout
      window.location.href = url
    } catch (err) {
      dispatch({
        type: 'error',
        message: err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.',
      })
    }
  }

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-bone-500">Étape 05 — Récapitulatif</p>
        <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
          Tout est en ordre.
        </h2>
        <p className="mt-3 text-[14.5px] text-bone-400">
          Relisez, puis payez l'acompte en ligne pour confirmer votre place.
          Le solde sera réglé sur place, le jour de votre venue.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Récapitulatif des choix ───────────────────────────────────── */}
        <div className="space-y-5">
          <RecapBlock
            label="Le rituel"
            onEdit={() => dispatch({ type: 'edit-from-recap', step: 'service', resumeToRecap: false })}
          >
            <div className="font-serif text-2xl text-bone-100">{ritual.name}</div>
            <div className="mt-1 text-[13.5px] text-bone-400">{ritual.tagline}</div>
            <div className="mt-3 flex items-center gap-3 text-[12px] uppercase tracking-wide-1 text-bone-500">
              <span>{formatDuration(ritual.duration)}</span>
              <span className="h-1 w-1 rounded-full bg-bone-500/60" />
              <span>{ritual.category}</span>
            </div>
          </RecapBlock>

          <RecapBlock
            label="Date & créneau"
            onEdit={() => dispatch({ type: 'edit-from-recap', step: 'date', resumeToRecap: true })}
          >
            <div className="font-serif text-2xl text-bone-100">
              {capitalize(formatDateLong(date))}
            </div>
            <div className="mt-1 text-[14px] text-bone-400">
              à <span className="text-bone-200">{draft.time}</span>
            </div>
          </RecapBlock>

          <RecapBlock
            label="Personnes"
            onEdit={() => dispatch({ type: 'edit-from-recap', step: 'guests', resumeToRecap: true })}
          >
            <div className="font-serif text-2xl text-bone-100">
              {draft.guests} personne{draft.guests > 1 ? 's' : ''}
            </div>
          </RecapBlock>

          <RecapBlock
            label="Vos coordonnées"
            onEdit={() => dispatch({ type: 'edit-from-recap', step: 'info', resumeToRecap: true })}
          >
            <div className="font-serif text-xl text-bone-100">
              {draft.guest.firstName} {draft.guest.lastName}
            </div>
            <div className="mt-2 space-y-1 text-[13.5px] text-bone-400">
              <div>{draft.guest.email}</div>
              <div>{draft.guest.phone}</div>
              {draft.guest.notes && (
                <p className="mt-3 border-l border-[var(--line)] pl-3 italic text-bone-500">
                  « {draft.guest.notes} »
                </p>
              )}
            </div>
          </RecapBlock>
        </div>

        {/* ── Panneau de paiement ───────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <div className="surface-warm rounded-sm p-8">
            <p className="eyebrow mb-6 text-ember-400">Acompte à régler maintenant</p>

            {/* Détail du tarif */}
            <div className="space-y-3 text-[14px]">
              <div className="flex items-baseline justify-between text-bone-300">
                <span>{ritual.name}</span>
                <span className="font-serif">{formatPrice(ritual.price)}</span>
              </div>
              {!ritual.perGroup && (
                <div className="flex items-baseline justify-between text-bone-400">
                  <span>× {draft.guests} personne{draft.guests > 1 ? 's' : ''}</span>
                  <span className="font-serif">{formatPrice(total)}</span>
                </div>
              )}
            </div>

            {/* Total + acompte */}
            <div className="mt-6 space-y-4 border-t border-ember-500/20 pt-6">
              <div className="flex items-baseline justify-between text-[14px]">
                <span className="text-bone-400">Total estimé</span>
                <span className="font-serif text-lg text-bone-200">{formatPrice(total)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="eyebrow text-bone-500">Acompte (30 %)</span>
                  <p className="mt-0.5 text-[11px] text-bone-500">Solde réglé sur place</p>
                </div>
                <span className="font-serif text-4xl text-bone-100">{formatPrice(deposit)}</span>
              </div>
            </div>

            {/* Erreur éventuelle */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="mt-6 rounded-sm border border-red-400/40 bg-red-500/10 p-4 text-[13px] text-red-200"
              >
                {error}
              </motion.div>
            )}

            {/* CTA Stripe */}
            <Button
              onClick={handlePayment}
              disabled={submitting}
              variant="primary"
              size="lg"
              dot
              className="mt-8 w-full justify-center"
            >
              {submitting
                ? 'Redirection vers le paiement…'
                : `Payer l'acompte — ${formatPrice(deposit)}`}
            </Button>

            {/* Badges de confiance */}
            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-bone-500">
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" width={12} height={12} fill="none">
                  <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 2 .7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                Paiement sécurisé
              </span>
              <span className="h-1 w-1 rounded-full bg-bone-500/40" />
              <span>Annulation gratuite 48h</span>
              <span className="h-1 w-1 rounded-full bg-bone-500/40" />
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 32 12" width={28} height={10} fill="none" aria-label="Stripe">
                  <text x="0" y="10" fontFamily="sans-serif" fontSize="10" fill="currentColor" opacity="0.6">stripe</text>
                </svg>
              </span>
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-12 flex items-center justify-between">
        <Button variant="ghost" onClick={() => dispatch({ type: 'go-to', step: prevStep('recap') })}>
          ← Retour
        </Button>
      </footer>
    </div>
  )
}

function RecapBlock({
  label,
  children,
  onEdit,
}: {
  label: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <div className="surface rounded-sm p-6 md:p-7">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-bone-500">{label}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11.5px] uppercase tracking-wide-1 text-bone-400 hover:text-ember-500 transition-colors duration-600"
        >
          Modifier
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
