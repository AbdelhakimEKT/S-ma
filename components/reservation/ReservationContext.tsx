'use client'

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { Guest, ReservationDraft, ReservationResult, ReservationStepId } from '@/lib/types'
import { createDraft, emptyGuest } from '@/lib/reservation'

/**
 * State container for the reservation flow.
 *
 * Kept deliberately small. The flow itself is the source of truth — when we
 * wire a backend later, only the `submit` thunk in the page-level component
 * needs to change, not this context.
 */

type State = {
  draft: ReservationDraft
  step: ReservationStepId
  result: ReservationResult | null
  submitting: boolean
  error: string | null
  resumeToRecap: boolean
}

type Action =
  | { type: 'set-ritual'; slug: string }
  | { type: 'set-date'; date: string }
  | { type: 'set-time'; time: string }
  | { type: 'set-guests'; guests: number }
  | { type: 'patch-guest'; patch: Partial<Guest> }
  | { type: 'go-to'; step: ReservationStepId }
  | { type: 'edit-from-recap'; step: ReservationStepId; resumeToRecap: boolean }
  | { type: 'submitting' }
  | { type: 'success'; result: ReservationResult }
  | { type: 'error'; message: string }
  | { type: 'reset'; ritualSlug?: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set-ritual':
      return {
        ...state,
        resumeToRecap: false,
        draft: { ...state.draft, ritualSlug: action.slug, date: null, time: null },
      }
    case 'set-date':
      return { ...state, draft: { ...state.draft, date: action.date, time: null } }
    case 'set-time':
      return { ...state, draft: { ...state.draft, time: action.time } }
    case 'set-guests':
      return { ...state, draft: { ...state.draft, guests: action.guests } }
    case 'patch-guest':
      return {
        ...state,
        draft: { ...state.draft, guest: { ...state.draft.guest, ...action.patch } },
      }
    case 'go-to':
      return {
        ...state,
        step: action.step,
        resumeToRecap: action.step === 'recap' || action.step === 'success'
          ? false
          : state.resumeToRecap,
      }
    case 'edit-from-recap':
      return {
        ...state,
        step: action.step,
        resumeToRecap: action.resumeToRecap,
      }
    case 'submitting':
      return { ...state, submitting: true, error: null }
    case 'success':
      return {
        ...state,
        submitting: false,
        result: action.result,
        step: 'success',
        resumeToRecap: false,
      }
    case 'error':
      return { ...state, submitting: false, error: action.message }
    case 'reset':
      return {
        draft: createDraft(action.ritualSlug),
        step: 'service',
        result: null,
        submitting: false,
        error: null,
        resumeToRecap: false,
      }
  }
}

interface ReservationContextValue extends State {
  dispatch: React.Dispatch<Action>
}

const Ctx = createContext<ReservationContextValue | null>(null)

export function ReservationProvider({
  initialRitualSlug,
  children,
}: {
  initialRitualSlug?: string
  children: ReactNode
}) {
  const initialState: State = {
    draft: {
      ritualSlug: initialRitualSlug ?? null,
      date: null,
      time: null,
      guests: 1,
      guest: { ...emptyGuest },
    },
    step: initialRitualSlug ? 'date' : 'service',
    result: null,
    submitting: false,
    error: null,
    resumeToRecap: false,
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo<ReservationContextValue>(() => ({ ...state, dispatch }), [state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useReservation() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useReservation must be used inside <ReservationProvider>.')
  return ctx
}

/* --------------------------------- Steps --------------------------------- */

export const STEPS: { id: ReservationStepId; label: string; index: number }[] = [
  { id: 'service', label: 'Rituel', index: 1 },
  { id: 'date', label: 'Date & créneau', index: 2 },
  { id: 'guests', label: 'Personnes', index: 3 },
  { id: 'info', label: 'Vos informations', index: 4 },
  { id: 'recap', label: 'Récapitulatif', index: 5 },
  { id: 'success', label: 'Confirmation', index: 6 },
]

export function nextStep(current: ReservationStepId): ReservationStepId {
  const i = STEPS.findIndex((s) => s.id === current)
  return STEPS[Math.min(i + 1, STEPS.length - 1)]!.id
}

export function prevStep(current: ReservationStepId): ReservationStepId {
  const i = STEPS.findIndex((s) => s.id === current)
  return STEPS[Math.max(i - 1, 0)]!.id
}
