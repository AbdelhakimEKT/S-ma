/**
 * /reservation/confirmation?session_id=cs_test_xxx
 *
 * Page de confirmation post-Stripe.
 *
 * Logique serveur :
 *   1. Récupérer la session Stripe (vérification du paiement)
 *   2. Récupérer la réservation en Supabase par stripe_session_id
 *   3. Si le webhook n'a pas encore tiré, confirmer soi-même la réservation
 *   4. Passer les données au composant client pour l'affichage
 */

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendReservationConfirmedEmails } from '@/lib/email'
import ConfirmationClient from './ConfirmationClient'
import type { DbReservation } from '@/lib/db-types'

export const metadata: Metadata = {
  title: 'Réservation confirmée',
  description: 'Votre rituel est réservé à la maison Söma. À très bientôt.',
}

export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect('/reservation')
  }

  // ── Vérifier la session Stripe ───────────────────────────────────────────
  let session
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId)
  } catch {
    notFound()
  }

  // Session inconnue ou expirée → 404
  if (!session || session.status === 'expired') {
    notFound()
  }

  // Paiement non abouti → renvoyer vers la page de réservation
  if (session.payment_status !== 'paid') {
    redirect('/reservation?cancelled=1')
  }

  // ── Récupérer la réservation en base ─────────────────────────────────────
  const { data: reservation } = await getSupabaseAdmin()
    .from('reservations')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (!reservation) {
    notFound()
  }

  let reservationToRender = reservation as DbReservation

  // ── Fallback si le webhook n'a pas encore tiré ────────────────────────────
  // (race condition rare mais possible en développement)
  if (reservation.status === 'pending_payment') {
    const { data: updatedReservation } = await getSupabaseAdmin()
      .from('reservations')
      .update({
        status: 'confirmed',
        stripe_payment_status: session.payment_status,
      })
      .eq('id', reservation.id)
      .eq('status', 'pending_payment')
      .select('*')
      .maybeSingle()

    if (updatedReservation) {
      reservationToRender = updatedReservation as DbReservation

      await sendReservationConfirmedEmails({
        id: updatedReservation.id,
        ritual_name: updatedReservation.ritual_name,
        date: updatedReservation.date,
        start_time: updatedReservation.start_time,
        guests: updatedReservation.guests,
        total_eur: Number(updatedReservation.total_eur),
        deposit_eur: Number(updatedReservation.deposit_eur),
        guest_first_name: updatedReservation.guest_first_name,
        guest_last_name: updatedReservation.guest_last_name,
        guest_email: updatedReservation.guest_email,
        guest_phone: updatedReservation.guest_phone,
        guest_notes: updatedReservation.guest_notes,
        stripe_payment_status: session.payment_status,
      })
    } else {
      const { data: freshReservation } = await getSupabaseAdmin()
        .from('reservations')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      if (freshReservation) {
        reservationToRender = freshReservation as DbReservation
      }
    }
  }

  return <ConfirmationClient reservation={reservationToRender} />
}
