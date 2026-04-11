'use client'

import { motion } from 'framer-motion'
import { useReservation } from './ReservationContext'
import { formatDateLong, formatPrice } from '@/lib/utils'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'

/**
 * Final state — soft success.
 *
 * Pendant l'animation : un cercle ember se dessine, puis le texte arrive.
 * Pas de "ouf, ça a marché". Une lettre courte, datée, signée.
 */
export default function StepSuccess() {
  const { result, dispatch } = useReservation()
  if (!result) return null

  const date = new Date(result.date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: ease.out }}
      className="text-center"
    >
      {/* Success mark */}
      <div className="relative mx-auto mb-10 flex h-24 w-24 items-center justify-center">
        <motion.span
          aria-hidden
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 1.4, ease: ease.out, times: [0, 0.6, 1] }}
          className="absolute inset-0 rounded-full bg-ember-500/15 blur-xl"
        />
        <motion.svg
          viewBox="0 0 100 100"
          className="relative h-full w-full"
          initial="hidden"
          animate="visible"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            stroke="#dcb084"
            strokeWidth="1.2"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: ease.out } },
            }}
          />
          <motion.path
            d="M30 52 L45 67 L72 36"
            stroke="#dcb084"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={{
              hidden: { pathLength: 0 },
              visible: { pathLength: 1, transition: { duration: 0.9, ease: ease.out, delay: 0.6 } },
            }}
          />
        </motion.svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: ease.out, delay: 1.4 }}
        className="eyebrow mb-4 text-bone-500"
      >
        Demande transmise · {result.id}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.1, ease: ease.out, delay: 1.6 }}
        className="font-serif text-display-md leading-[1.02] text-bone-100"
      >
        À très bientôt, <span className="italic text-bone-300">{result.guest.firstName}.</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 1.9 }}
        className="mx-auto mt-10 max-w-xl text-pretty text-[16px] leading-relaxed text-bone-300"
      >
        <p>
          Nous avons bien reçu votre demande pour{' '}
          <span className="text-bone-100">{result.ritualName}</span>, le{' '}
          <span className="text-bone-100">
            {capitalize(formatDateLong(date))} à {result.time}
          </span>
          , pour {result.guests} personne{result.guests > 1 ? 's' : ''}.
        </p>
        <p className="mt-5">
          Un mail de confirmation vient de partir vers <span className="text-bone-100">{result.guest.email}</span>.
          Si pour une raison ou une autre il n'arrive pas dans la demi-heure,
          appelez-nous — on retrouve toujours.
        </p>
        <p className="mt-8 font-serif italic text-bone-400">
          — Inès & l'équipe Söma
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 2.2 }}
        className="mx-auto mt-12 max-w-md surface rounded-sm p-6 text-left"
      >
        <p className="eyebrow mb-4 text-bone-500">Pour mémoire</p>
        <dl className="space-y-3 text-[13.5px]">
          <Row label="Numéro de demande" value={result.id} />
          <Row label="Rituel" value={result.ritualName} />
          <Row label="Date" value={capitalize(formatDateLong(date))} />
          <Row label="Heure" value={result.time} />
          <Row label="Personnes" value={String(result.guests)} />
          <Row label="Total estimé" value={formatPrice(result.total)} />
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 2.4 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
      >
        <Button href="/" variant="outline">Retour à l'accueil</Button>
        <Button onClick={() => dispatch({ type: 'reset' })} variant="ghost">
          Faire une autre réservation
        </Button>
      </motion.div>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2 last:border-0">
      <dt className="text-bone-500">{label}</dt>
      <dd className="text-right text-bone-100">{value}</dd>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
