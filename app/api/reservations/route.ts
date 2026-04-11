/**
 * POST /api/reservations
 *
 * Crée une réservation en Supabase avec le statut `pending_payment`.
 * Vérifie une dernière fois la disponibilité du créneau avant d'écrire
 * (rempart contre les race conditions).
 *
 * Body : ReservationDraft (depuis le contexte front)
 * Response : { id, totalEur, depositEur }
 */

import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isSlotStillAvailable, minutesToTimeStr } from '@/lib/availability'
import { getRitualBySlug } from '@/data/rituals'
import { computeTotal, computeDeposit } from '@/lib/reservation'
import { sendReservationReceivedEmails } from '@/lib/email'
import type { ReservationDraft } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let draft: ReservationDraft

  try {
    draft = (await request.json()) as ReservationDraft
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  // ── Validation de base ────────────────────────────────────────────────────
  const { ritualSlug, date, time, guests, guest } = draft

  if (!ritualSlug || !date || !time || !guests || !guest) {
    return NextResponse.json({ error: 'Données incomplètes.' }, { status: 400 })
  }

  const ritual = getRitualBySlug(ritualSlug)
  if (!ritual) {
    return NextResponse.json({ error: 'Rituel introuvable.' }, { status: 404 })
  }

  if (guests < 1 || guests > ritual.maxGuests) {
    return NextResponse.json(
      { error: `Nombre de personnes invalide (max ${ritual.maxGuests}).` },
      { status: 400 },
    )
  }

  // ── Vérification de disponibilité (dernière chance) ───────────────────────
  const available = await isSlotStillAvailable(date, time, ritual.duration)
  if (!available) {
    return NextResponse.json(
      { error: 'Ce créneau vient d\'être réservé. Choisissez un autre.' },
      { status: 409 },
    )
  }

  // ── Calcul des montants ───────────────────────────────────────────────────
  const totalEur   = computeTotal(ritual, guests)
  const depositEur = computeDeposit(totalEur)

  // ── Calcul des horaires ───────────────────────────────────────────────────
  const [hh, mm]  = time.split(':').map(Number)
  const startMin  = (hh ?? 0) * 60 + (mm ?? 0)
  const endMin    = startMin + ritual.duration
  const startTime = minutesToTimeStr(startMin)
  const endTime   = minutesToTimeStr(endMin)

  // ── Écriture en base ──────────────────────────────────────────────────────
  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .insert({
      ritual_slug:          ritual.slug,
      ritual_name:          ritual.name,
      date,
      start_time:           startTime,
      end_time:             endTime,
      duration_minutes:     ritual.duration,
      guests,
      total_eur:            totalEur,
      deposit_eur:          depositEur,
      status:               'pending_payment',
      stripe_session_id:    null,
      stripe_payment_status: null,
      guest_first_name:     guest.firstName.trim(),
      guest_last_name:      guest.lastName.trim(),
      guest_email:          guest.email.trim().toLowerCase(),
      guest_phone:          guest.phone.trim(),
      guest_notes:          guest.notes?.trim() || null,
      guest_newsletter:     guest.newsletter,
    })
    .select('id')
    .single()

  const row = data as { id: string } | null

  if (error || !row) {
    console.error('[/api/reservations] Supabase insert error:', error?.message)
    return NextResponse.json(
      { error: 'Impossible d\'enregistrer la réservation. Réessayez.' },
      { status: 500 },
    )
  }

  await sendReservationReceivedEmails({
    id: row.id,
    ritual_name: ritual.name,
    date,
    start_time: startTime,
    guests,
    total_eur: totalEur,
    deposit_eur: depositEur,
    guest_first_name: guest.firstName.trim(),
    guest_last_name: guest.lastName.trim(),
    guest_email: guest.email.trim().toLowerCase(),
    guest_phone: guest.phone.trim(),
    guest_notes: guest.notes?.trim() || null,
  })

  return NextResponse.json({ id: row.id, totalEur, depositEur }, { status: 201 })
}
