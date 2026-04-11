/**
 * Moteur de disponibilité — serveur uniquement.
 *
 * Logique : 1 seul salon / 1 seule cabine.
 * Un créneau est disponible si aucune réservation non-annulée ne
 * chevauche la fenêtre [start, start + duration).
 *
 * L'overlap standard : conflitA↔B = startA < endB && endA > startB
 */

import { getSupabaseAdmin } from './supabase'
import { fromISODate, toISODate } from './utils'

// ─── Horaires d'ouverture ──────────────────────────────────────────────────
// 0 = dimanche, 1 = lundi, ..., 6 = samedi (getDay() convention)
export const OPENING: Record<number, { open: number; close: number } | null> = {
  0: { open: 10, close: 20 },   // dimanche
  1: null,                       // lundi — repos de la maison
  2: { open: 11, close: 21 },   // mardi
  3: { open: 11, close: 21 },   // mercredi
  4: { open: 11, close: 22 },   // jeudi
  5: { open: 11, close: 22 },   // vendredi
  6: { open: 10, close: 22 },   // samedi
}

const SLOT_STEP_MINUTES = 30   // grille de créneaux toutes les 30 min

// ─── Types locaux ──────────────────────────────────────────────────────────

export interface SlotResult {
  time: string        // "HH:MM"
  available: boolean
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** "HH:MM" → minutes depuis minuit */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** "HH:MM:SS" ou "HH:MM" → minutes depuis minuit */
function timeStrToMinutes(t: string): number {
  const parts = t.split(':').map(Number)
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
}

/** minutes → "HH:MM:SS" (format stocké en base) */
export function minutesToTimeStr(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`
}

/** minutes → "HH:MM" (format affiché à l'utilisateur) */
function minutesToDisplay(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
}

// ─── Fonction principale ───────────────────────────────────────────────────

/**
 * Retourne tous les créneaux candidats pour une date donnée, avec leur
 * disponibilité calculée contre les réservations existantes en base.
 *
 * @param durationMinutes  Durée de la prestation en minutes
 * @param isoDate          "YYYY-MM-DD"
 */
export async function getSlotsForDate(
  durationMinutes: number,
  isoDate: string,
): Promise<SlotResult[]> {
  const dateObj = fromISODate(isoDate)
  const dayOfWeek = dateObj.getDay()
  const hours = OPENING[dayOfWeek]

  if (!hours) return []  // maison fermée ce jour

  // 1. Générer la grille de créneaux candidats
  const openMin  = hours.open  * 60
  const closeMin = hours.close * 60
  // Le dernier créneau doit finir avant la fermeture
  const lastStartMin = closeMin - durationMinutes

  if (lastStartMin < openMin) return []

  const candidates: number[] = []
  for (let m = openMin; m <= lastStartMin; m += SLOT_STEP_MINUTES) {
    candidates.push(m)
  }

  // 2. Filtrer les créneaux passés si c'est aujourd'hui
  const todayIso = toISODate(new Date())
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const isToday = isoDate === todayIso

  const futureOnly = isToday
    ? candidates.filter((m) => m >= nowMin + 60)  // buffer 60 min
    : candidates

  if (futureOnly.length === 0) return []

  // 3. Récupérer les réservations existantes non annulées pour cette date
  const { data: existing, error } = await getSupabaseAdmin()
    .from('reservations')
    .select('start_time, end_time')
    .eq('date', isoDate)
    .not('status', 'in', '("cancelled","failed")')

  if (error) {
    console.error('[availability] Supabase error:', error.message)
    // On retourne les slots sans filtrage plutôt que de planter
    return futureOnly.map((m) => ({ time: minutesToDisplay(m), available: true }))
  }

  const rows = (existing ?? []) as { start_time: string; end_time: string }[]
  const booked = rows.map((r) => ({
    startMin: timeStrToMinutes(r.start_time),
    endMin:   timeStrToMinutes(r.end_time),
  }))

  // 4. Construire le résultat
  return futureOnly.map((startMin) => {
    const endMin = startMin + durationMinutes
    // Conflict si : startMin < existingEnd && endMin > existingStart
    const conflict = booked.some(
      (b) => startMin < b.endMin && endMin > b.startMin,
    )
    return { time: minutesToDisplay(startMin), available: !conflict }
  })
}

// ─── Validation au moment de la création ─────────────────────────────────

/**
 * Vérifie qu'un créneau est toujours libre juste avant d'écrire en base.
 * Dernier rempart contre les double-bookings (race condition).
 */
export async function isSlotStillAvailable(
  isoDate: string,
  startTimeHHMM: string,
  durationMinutes: number,
): Promise<boolean> {
  const startMin = toMinutes(startTimeHHMM)
  const endMin = startMin + durationMinutes
  const startStr = minutesToTimeStr(startMin)
  const endStr   = minutesToTimeStr(endMin)

  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .select('id')
    .eq('date', isoDate)
    .not('status', 'in', '("cancelled","failed")')
    .lt('start_time', endStr)    // existing.start < newEnd
    .gt('end_time', startStr)    // existing.end   > newStart
    .limit(1)

  if (error) {
    console.error('[availability] isSlotStillAvailable error:', error.message)
    return false  // bloque par précaution
  }

  return (data ?? []).length === 0
}
