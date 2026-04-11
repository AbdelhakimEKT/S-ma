'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReservation, nextStep, prevStep } from './ReservationContext'
import { getRitualBySlug } from '@/data/rituals'
import { isDateOpen } from '@/lib/reservation'
import { cn, formatDateLong, toISODate } from '@/lib/utils'
import { ease } from '@/lib/motion'
import Button from '@/components/ui/Button'
import type { SlotResult } from '@/lib/availability'

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

/**
 * Step 2 — date et créneau.
 *
 * Calendrier custom (sans librairie). Les créneaux sont chargés depuis
 * /api/slots pour refléter les vraies disponibilités en base.
 * Logique : 1 salon / 1 cabine → pas de chevauchement possible.
 */
export default function StepDate() {
  const { draft, dispatch, resumeToRecap } = useReservation()
  const ritual = draft.ritualSlug ? getRitualBySlug(draft.ritualSlug) : undefined

  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  // Slots chargés depuis l'API
  const [slots, setSlots]         = useState<SlotResult[]>([])
  const [loadingSlots, setLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotNotice, setSlotNotice] = useState<string | null>(null)

  async function refreshSlots(options?: {
    signal?: AbortSignal
    silent?: boolean
    selectedTime?: string | null
  }) {
    if (!draft.ritualSlug || !draft.date) {
      setSlots([])
      return [] as SlotResult[]
    }

    if (!options?.silent) {
      setLoading(true)
    }

    setSlotsError(null)

    try {
      const response = await fetch(`/api/slots?ritual=${draft.ritualSlug}&date=${draft.date}`, {
        signal: options?.signal,
        cache: 'no-store',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error((payload as { error?: string }).error ?? 'Erreur serveur')
      }

      const data = (await response.json()) as { slots: SlotResult[] }
      setSlots(data.slots)

      const selectedTime = options?.selectedTime ?? draft.time
      if (selectedTime) {
        const selected = data.slots.find((slot) => slot.time === selectedTime)
        if (!selected || !selected.available) {
          dispatch({ type: 'set-time', time: '' as any })
          setSlotNotice('Ce créneau vient d’être réservé. Choisissez-en un autre.')
        }
      }

      return data.slots
    } catch (error) {
      if ((error as { name?: string }).name !== 'AbortError') {
        setSlotsError(error instanceof Error ? error.message : 'Impossible de charger les créneaux.')
      }
      return [] as SlotResult[]
    } finally {
      if (!options?.silent) {
        setLoading(false)
      }
    }
  }

  // Recharger les créneaux quand la date ou le rituel change
  useEffect(() => {
    if (!draft.ritualSlug || !draft.date) {
      setSlots([])
      setSlotNotice(null)
      return
    }

    const controller = new AbortController()
    void refreshSlots({ signal: controller.signal, selectedTime: draft.time })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.ritualSlug, draft.date])

  useEffect(() => {
    if (!draft.ritualSlug || !draft.date) return

    const intervalId = window.setInterval(() => {
      void refreshSlots({ silent: true, selectedTime: draft.time })
    }, 15000)

    function handleFocus() {
      void refreshSlots({ silent: true, selectedTime: draft.time })
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.ritualSlug, draft.date, draft.time])

  const grid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor])

  if (!ritual) {
    return <p className="text-bone-400">Veuillez d'abord choisir un rituel.</p>
  }

  function handleMonthChange(delta: number) {
    setMonthCursor((d) => {
      const next = new Date(d)
      next.setMonth(next.getMonth() + delta)
      return next
    })
  }

  function handleDayClick(date: Date) {
    if (!isDateOpen(date)) return
    const iso = toISODate(date)
    setSlotNotice(null)
    dispatch({ type: 'set-date', date: iso })
  }

  function handleSlotClick(s: SlotResult) {
    if (!s.available) return
    setSlotNotice(null)
    dispatch({ type: 'set-time', time: s.time })
  }

  async function handleContinue() {
    if (!draft.date || !draft.time) return

    const freshSlots = await refreshSlots({ selectedTime: draft.time })
    const selected = freshSlots.find((slot) => slot.time === draft.time)

    if (!selected?.available) {
      setSlotNotice('Ce créneau n’est plus disponible. Sélectionnez-en un autre pour continuer.')
      return
    }

    dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : nextStep('date') })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const availableCount = slots.filter((s) => s.available).length

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-bone-500">Étape 02 — Date & créneau</p>
        <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
          Quand voulez-vous venir ralentir ?
        </h2>
        <p className="mt-3 text-[14.5px] text-bone-400">
          Pour <span className="text-bone-200">{ritual.name}</span> · {ritual.duration} minutes au total.
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* ── Calendrier ────────────────────────────────────────────────── */}
        <div className="surface rounded-sm p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleMonthChange(-1)}
              aria-label="Mois précédent"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-bone-300 hover:text-bone-100 hover:border-bone-400/40 transition-all duration-600 ease-soma"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" className="-scale-x-100">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="font-serif text-xl text-bone-100">
              {new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(monthCursor)}
            </div>

            <button
              type="button"
              onClick={() => handleMonthChange(1)}
              aria-label="Mois suivant"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-bone-300 hover:text-bone-100 hover:border-bone-400/40 transition-all duration-600 ease-soma"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Entête des jours */}
          <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide-1 text-bone-500">
            {WEEKDAY_LABELS.map((d, i) => <div key={i}>{d}</div>)}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, i) => {
              if (!cell) return <div key={i} className="aspect-square" />
              const iso      = toISODate(cell)
              const open     = isDateOpen(cell)
              const isToday  = cell.getTime() === today.getTime()
              const selected = draft.date === iso

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(cell)}
                  disabled={!open}
                  aria-pressed={selected}
                  className={cn(
                    'relative aspect-square flex items-center justify-center rounded-sm text-[13.5px]',
                    'transition-all duration-400 ease-soma',
                    open
                      ? 'text-bone-200 hover:bg-bone-100/[0.06]'
                      : 'cursor-not-allowed text-bone-500/35',
                    selected && 'bg-ember-500/20 text-bone-100',
                    isToday && !selected && 'border border-[var(--line-strong)]',
                  )}
                >
                  {cell.getDate()}
                  {selected && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ember-500" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-bone-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
              Sélection
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-sm border border-[var(--line-strong)]" />
              Aujourd'hui
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-sm bg-bone-500/20" />
              Maison fermée
            </span>
          </div>
        </div>

        {/* ── Créneaux ──────────────────────────────────────────────────── */}
        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-xl text-bone-100">
              {draft.date
                ? `Créneaux — ${formatDateLong(new Date(draft.date))}`
                : 'Choisissez une date'}
            </h3>
            {draft.date && !loadingSlots && (
              <span className="text-[12px] text-bone-500">
                {availableCount} disponible{availableCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!draft.date && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="surface rounded-sm p-8 text-[14px] leading-relaxed text-bone-400"
              >
                Sélectionnez une date dans le calendrier pour voir les créneaux disponibles.
                Les rituels longs s'arrêtent une heure avant la fermeture.
              </motion.div>
            )}

            {draft.date && loadingSlots && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: ease.out }}
                className="grid grid-cols-4 gap-2"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[2/1] animate-pulse rounded-sm border border-[var(--line)] bg-bone-100/[0.02]"
                  />
                ))}
              </motion.div>
            )}

            {draft.date && !loadingSlots && (
              <motion.div
                key={draft.date}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: ease.out }}
              >
                {slotNotice && (
                  <div className="mb-4 rounded-sm border border-amber-400/30 bg-amber-500/10 p-4 text-[13px] text-amber-100">
                    {slotNotice}
                  </div>
                )}
                {slotsError ? (
                  <div className="surface rounded-sm p-6 text-[14px] text-bone-400">
                    {slotsError} — <button className="underline text-ember-500" onClick={() => void refreshSlots({ selectedTime: draft.time })}>Réessayer</button>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="surface rounded-sm p-6 text-[14px] text-bone-400">
                    Aucun créneau disponible ce jour-là. Choisissez une autre date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => {
                      const selected = draft.time === s.time
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => handleSlotClick(s)}
                          className={cn(
                            'relative rounded-sm border px-3 py-3 text-[13.5px]',
                            'transition-all duration-500 ease-soma',
                            !s.available
                              ? 'cursor-not-allowed border-[var(--line)] text-bone-500/40 line-through'
                              : selected
                              ? 'border-ember-500 bg-ember-500/15 text-bone-100 shadow-[0_0_30px_-12px_rgba(220,176,132,0.6)]'
                              : 'border-[var(--line)] text-bone-200 hover:border-bone-400/40 hover:bg-bone-100/[0.04]',
                          )}
                        >
                          {s.time}
                          {s.available && selected && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-ember-500 text-ink-900">
                              <svg viewBox="0 0 12 12" width={8} height={8} fill="none">
                                <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-12 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : prevStep('date') })}
        >
          ← Retour
        </Button>
        <Button
          variant="primary"
          onClick={() => void handleContinue()}
          disabled={!draft.date || !draft.time || loadingSlots}
          dot
        >
          Continuer
        </Button>
      </footer>
    </div>
  )
}

function buildMonthGrid(cursor: Date): (Date | null)[] {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  while (cells.length < 42) cells.push(null)
  return cells
}
