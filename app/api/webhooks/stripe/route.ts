/**
 * POST /api/webhooks/stripe
 *
 * Reçoit les événements Stripe et met à jour les réservations en base.
 *
 * En développement : stripe listen --forward-to localhost:3000/api/webhooks/stripe
 * La signature est vérifiée pour chaque requête — ne jamais faire confiance
 * au body sans la vérifier.
 */

import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendReservationConfirmedEmails, sendReservationFailedEmails } from '@/lib/email'

// Pas de middleware JSON — le body brut est requis pour la vérification Stripe.
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET non configuré.')
    return new NextResponse('Configuration manquante.', { status: 500 })
  }

  // ── Vérification de signature ────────────────────────────────────────────
  let event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('[webhook] Signature invalide:', err)
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 })
  }

  // ── Traitement des événements ────────────────────────────────────────────
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const reservationId = session.metadata?.reservation_id

      if (!reservationId) {
        console.warn('[webhook] checkout.session.completed sans reservation_id')
        break
      }

      const { data: reservation, error } = await getSupabaseAdmin()
        .from('reservations')
        .update({
          status:                'confirmed' as string,
          stripe_payment_status: session.payment_status as string,
        })
        .eq('id', reservationId)
        .eq('status', 'pending_payment')
        .select('*')
        .maybeSingle()

      if (error) {
        console.error('[webhook] Supabase update error:', error.message)
        // On retourne 500 → Stripe retentera plus tard.
        return new NextResponse('Erreur de mise à jour.', { status: 500 })
      }

      if (reservation) {
        await sendReservationConfirmedEmails({
          id: reservation.id,
          ritual_name: reservation.ritual_name,
          date: reservation.date,
          start_time: reservation.start_time,
          guests: reservation.guests,
          total_eur: Number(reservation.total_eur),
          deposit_eur: Number(reservation.deposit_eur),
          guest_first_name: reservation.guest_first_name,
          guest_last_name: reservation.guest_last_name,
          guest_email: reservation.guest_email,
          guest_phone: reservation.guest_phone,
          guest_notes: reservation.guest_notes,
          stripe_payment_status: session.payment_status as string,
        })
      }

      console.info(`[webhook] Réservation confirmée : ${reservationId}`)
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object
      const reservationId = session.metadata?.reservation_id

      if (reservationId) {
        const { data: reservation } = await getSupabaseAdmin()
          .from('reservations')
          .update({ status: 'failed', stripe_payment_status: 'expired' })
          .eq('id', reservationId)
          .eq('status', 'pending_payment')  // ne pas écraser si déjà confirmée
          .select('*')
          .maybeSingle()

        if (reservation) {
          await sendReservationFailedEmails({
            id: reservation.id,
            ritual_name: reservation.ritual_name,
            date: reservation.date,
            start_time: reservation.start_time,
            guests: reservation.guests,
            total_eur: Number(reservation.total_eur),
            deposit_eur: Number(reservation.deposit_eur),
            guest_first_name: reservation.guest_first_name,
            guest_last_name: reservation.guest_last_name,
            guest_email: reservation.guest_email,
            guest_phone: reservation.guest_phone,
            guest_notes: reservation.guest_notes,
            stripe_payment_status: 'expired',
          })
        }

        console.info(`[webhook] Session expirée → réservation annulée : ${reservationId}`)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object
      const reservationId = pi.metadata?.reservation_id

      if (reservationId) {
        const { data: reservation } = await getSupabaseAdmin()
          .from('reservations')
          .update({ status: 'failed', stripe_payment_status: 'payment_failed' })
          .eq('id', reservationId)
          .eq('status', 'pending_payment')
          .select('*')
          .maybeSingle()

        if (reservation) {
          await sendReservationFailedEmails({
            id: reservation.id,
            ritual_name: reservation.ritual_name,
            date: reservation.date,
            start_time: reservation.start_time,
            guests: reservation.guests,
            total_eur: Number(reservation.total_eur),
            deposit_eur: Number(reservation.deposit_eur),
            guest_first_name: reservation.guest_first_name,
            guest_last_name: reservation.guest_last_name,
            guest_email: reservation.guest_email,
            guest_phone: reservation.guest_phone,
            guest_notes: reservation.guest_notes,
            stripe_payment_status: 'payment_failed',
          })
        }
      }
      break
    }

    default:
      // Événement non géré — on ignore proprement.
      break
  }

  return new NextResponse(null, { status: 200 })
}
