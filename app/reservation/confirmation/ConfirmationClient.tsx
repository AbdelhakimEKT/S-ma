'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'
import type { DbReservation } from '@/lib/db-types'
import { formatPrice } from '@/lib/utils'

/**
 * Composant client de la page de confirmation.
 *
 * Reçoit la réservation confirmée depuis le Server Component parent.
 * L'UI est calme, signée, mémorable — comme une lettre à la fin d'un repas.
 */
export default function ConfirmationClient({
  reservation: r,
}: {
  reservation: DbReservation
}) {
  // Formater la date
  const dateLabel = (() => {
    const d = new Date(r.date + 'T12:00:00')
    const raw = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long',
    }).format(d)
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  })()

  return (
    <div className="min-h-screen pt-[calc(var(--header-h)+3rem)] pb-section">
      <div className="container max-w-3xl text-center">
        {/* ── Cercle de succès ─────────────────────────────────────────── */}
        <div className="relative mx-auto mb-12 flex h-28 w-28 items-center justify-center">
          <motion.span
            aria-hidden
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: ease.out }}
            className="absolute inset-0 rounded-full bg-ember-500/12 blur-2xl"
          />
          <motion.svg
            viewBox="0 0 100 100"
            className="relative h-full w-full"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="50" cy="50" r="46"
              stroke="#c69769" strokeWidth="1"
              fill="none"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1, opacity: 1,
                  transition: { duration: 1.6, ease: ease.out },
                },
              }}
            />
            <motion.circle
              cx="50" cy="50" r="38"
              stroke="rgba(198,151,105,0.3)" strokeWidth="0.5"
              fill="none"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1, opacity: 1,
                  transition: { duration: 1.4, ease: ease.out, delay: 0.2 },
                },
              }}
            />
            <motion.path
              d="M30 52 L45 67 L72 36"
              stroke="#dcb084" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              fill="none"
              variants={{
                hidden: { pathLength: 0 },
                visible: {
                  pathLength: 1,
                  transition: { duration: 0.9, ease: ease.out, delay: 0.8 },
                },
              }}
            />
          </motion.svg>
        </div>

        {/* ── Référence ────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ease.out, delay: 1.5 }}
          className="eyebrow mb-5 text-bone-500"
        >
          Réservation confirmée · {r.id.split('-')[0]?.toUpperCase()}
        </motion.p>

        {/* ── Titre ────────────────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: ease.out, delay: 1.7 }}
          className="font-serif text-display-md leading-[1.02] text-bone-100"
        >
          À très bientôt,{' '}
          <span className="italic text-bone-300">{r.guest_first_name}.</span>
        </motion.h1>

        {/* ── Lettre ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: ease.out, delay: 1.95 }}
          className="mx-auto mt-10 max-w-[56ch] text-pretty text-[16.5px] leading-[1.85] text-bone-300"
        >
          <p>
            Votre acompte de{' '}
            <span className="text-bone-100">{formatPrice(r.deposit_eur)}</span> a bien
            été encaissé. Votre place pour{' '}
            <span className="text-bone-100">{r.ritual_name}</span> est réservée le{' '}
            <span className="text-bone-100">{dateLabel} à {r.start_time.slice(0, 5)}</span>
            {r.guests > 1 && (
              <>, pour <span className="text-bone-100">{r.guests} personnes</span></>
            )}.
          </p>
          <p className="mt-5">
            Un email de confirmation vient d'être envoyé à{' '}
            <span className="text-bone-100">{r.guest_email}</span>.
            Le solde de{' '}
            <span className="text-bone-100">{formatPrice(r.total_eur - r.deposit_eur)}</span>{' '}
            sera réglé sur place. Annulation gratuite jusqu'à 48 heures avant.
          </p>
          {r.guest_notes && (
            <p className="mt-5 border-l border-[var(--line)] pl-4 italic text-bone-400">
              Nous avons bien noté : « {r.guest_notes} »
            </p>
          )}
          <p className="mt-8 font-serif italic text-bone-400">
            — Inès & l'équipe Söma
          </p>
        </motion.div>

        {/* ── Récapitulatif ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: ease.out, delay: 2.2 }}
          className="mx-auto mt-12 max-w-lg text-left surface rounded-sm p-7"
        >
          <p className="eyebrow mb-5 text-bone-500">Pour mémoire</p>
          <dl className="space-y-3">
            <Row label="Référence"  value={r.id.split('-')[0]!.toUpperCase()} />
            <Row label="Rituel"     value={r.ritual_name} />
            <Row label="Date"       value={dateLabel} />
            <Row label="Heure"      value={r.start_time.slice(0, 5)} />
            <Row label="Personnes"  value={String(r.guests)} />
            <Row label="Total estimé" value={formatPrice(r.total_eur)} />
            <Row label="Acompte payé" value={formatPrice(r.deposit_eur)} accent />
            <Row label="Solde sur place" value={formatPrice(r.total_eur - r.deposit_eur)} />
          </dl>
        </motion.div>

        {/* ── Infos pratiques ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: ease.out, delay: 2.45 }}
          className="mx-auto mt-10 max-w-lg text-left surface rounded-sm p-7"
        >
          <p className="eyebrow mb-5 text-bone-500">Informations pratiques</p>
          <ul className="space-y-3 text-[14px] leading-relaxed text-bone-400">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember-500" />
              <span>
                <span className="text-bone-200">Arrivez 15 minutes avant</span> votre rituel
                pour prendre le temps de vous installer.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember-500" />
              <span>
                <span className="text-bone-200">12 rue des Carmes</span>, Orléans — tram
                ligne A, arrêt Cathédrale (3 min à pied).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ember-500" />
              <span>
                Tout est fourni : peignoir, mules, serviette, savon noir, infusions.
                Venez avec votre maillot de bain si vous utilisez le hammam.
              </span>
            </li>
          </ul>
        </motion.div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: ease.out, delay: 2.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/" variant="outline">Retour à l'accueil</Button>
          <Button href="/rituels" variant="ghost">Découvrir tous les rituels</Button>
        </motion.div>

        {/* ── Signature finale ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: ease.out, delay: 3 }}
          aria-hidden
          className="mt-20 font-serif text-[18vw] leading-none tracking-tight-2 text-bone-100/[0.04] select-none"
        >
          Söma
        </motion.div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2.5 last:border-0">
      <dt className="text-[13.5px] text-bone-500">{label}</dt>
      <dd className={`text-right font-serif text-[15px] ${accent ? 'text-ember-400' : 'text-bone-100'}`}>
        {value}
      </dd>
    </div>
  )
}
