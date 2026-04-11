/**
 * Logique de réservation — côté client uniquement.
 *
 * Ce fichier ne contient que du code sans effets de bord (pas de DB,
 * pas de Stripe). La validation et le calcul des totaux vivent ici ;
 * la persistance et les disponibilités sont dans les API routes.
 */

import type { Ritual, Guest, ReservationDraft } from './types'
import { getRitualBySlug } from '@/data/rituals'
import { EMAIL_RE, PHONE_RE } from './utils'

// ─── Horaires (mirroir client de lib/availability.ts) ──────────────────────
// Utilisé par le calendrier pour désactiver les jours fermés sans round-trip.
export const OPENING: Record<number, { open: number; close: number } | null> = {
  0: { open: 10, close: 20 },
  1: null,
  2: { open: 11, close: 21 },
  3: { open: 11, close: 21 },
  4: { open: 11, close: 22 },
  5: { open: 11, close: 22 },
  6: { open: 10, close: 22 },
}

/** Vrai si la maison est ouverte ce jour-là et si la date est dans le futur. */
export function isDateOpen(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date.getTime() < today.getTime()) return false
  return OPENING[date.getDay()] != null
}

// ─── Totaux ────────────────────────────────────────────────────────────────

/** Total en euros (par personne sauf perGroup). */
export function computeTotal(ritual: Ritual, guests: number): number {
  return ritual.perGroup ? ritual.price : ritual.price * guests
}

/**
 * Acompte en euros — 30 % du total, minimum 20 €.
 * Arrondi à l'euro le plus proche.
 */
export function computeDeposit(totalEur: number): number {
  return Math.max(20, Math.round(totalEur * 0.3))
}

// ─── Validation ────────────────────────────────────────────────────────────

export type ValidationErrors = Partial<
  Record<keyof Guest | 'date' | 'time' | 'ritual' | 'guests', string>
>

export function validateStep(
  step: 'service' | 'date' | 'guests' | 'info',
  draft: ReservationDraft,
): ValidationErrors {
  const errors: ValidationErrors = {}

  if (step === 'service' && !draft.ritualSlug) {
    errors.ritual = 'Choisissez un rituel pour poursuivre.'
  }

  if (step === 'date') {
    if (!draft.date) errors.date = 'Sélectionnez une date.'
    if (!draft.time) errors.time = 'Sélectionnez un créneau.'
  }

  if (step === 'guests') {
    const ritual = draft.ritualSlug ? getRitualBySlug(draft.ritualSlug) : undefined
    if (!ritual) {
      errors.ritual = 'Rituel introuvable.'
    } else if (draft.guests < 1) {
      errors.guests = 'Au moins une personne.'
    } else if (draft.guests > ritual.maxGuests) {
      errors.guests = `Ce rituel accueille jusqu'à ${ritual.maxGuests} personne${ritual.maxGuests > 1 ? 's' : ''}.`
    }
  }

  if (step === 'info') {
    const { firstName, lastName, email, phone, consent } = draft.guest
    if (firstName.trim().length < 2) errors.firstName = "Votre prénom, s'il vous plaît."
    if (lastName.trim().length < 2)  errors.lastName  = "Votre nom, s'il vous plaît."
    if (!EMAIL_RE.test(email))        errors.email    = 'Un email valide pour la confirmation.'
    if (!PHONE_RE.test(phone))        errors.phone    = 'Un numéro pour pouvoir vous joindre.'
    if (!consent)                     errors.consent  = 'Nous avons besoin de votre accord pour traiter la demande.'
  }

  return errors
}

// ─── Defaults ──────────────────────────────────────────────────────────────

export const emptyGuest: Guest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: '',
  newsletter: false,
  consent: false,
}

export function createDraft(ritualSlug?: string): ReservationDraft {
  return {
    ritualSlug: ritualSlug ?? null,
    date: null,
    time: null,
    guests: 1,
    guest: { ...emptyGuest },
  }
}
