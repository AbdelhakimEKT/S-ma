/**
 * POST /api/checkout
 *
 * Crée une session Stripe Checkout pour le paiement de l'acompte,
 * met à jour la réservation avec l'ID de session, et retourne l'URL
 * de redirection Stripe.
 *
 * Body : { reservationId: string }
 * Response : { url: string }
 */

import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { DbReservation } from '@/lib/db-types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: { reservationId?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 })
  }

  const { reservationId } = body
  if (!reservationId) {
    return NextResponse.json({ error: 'reservationId requis.' }, { status: 400 })
  }

  // ── Récupérer la réservation ───────────────────────────────────────────────
  const { data: _reservationRaw, error: fetchErr } = await getSupabaseAdmin()
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .single()

  const reservation = _reservationRaw as DbReservation | null

  if (fetchErr || !reservation) {
    return NextResponse.json({ error: 'Réservation introuvable.' }, { status: 404 })
  }

  if (reservation.status !== 'pending_payment') {
    return NextResponse.json(
      { error: 'Cette réservation n\'est plus en attente de paiement.' },
      { status: 409 },
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const depositCents = Math.round(reservation.deposit_eur * 100)

  // ── Formater la date pour la description Stripe ───────────────────────────
  const dateObj = new Date(reservation.date + 'T12:00:00')
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(dateObj)

  // ── Créer la session Stripe ────────────────────────────────────────────────
  let session
  try {
    session = await getStripe().checkout.sessions.create({
      mode:                 'payment',
      payment_method_types: ['card'],
      locale:               'fr',
      customer_email:       reservation.guest_email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency:     'eur',
            unit_amount:  depositCents,
            product_data: {
              name: `Acompte — ${reservation.ritual_name}`,
              description: [
                `${dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)} à ${reservation.start_time.slice(0, 5)}`,
                `${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}`,
                `Total : ${formatPrice(reservation.total_eur)} • Acompte : ${formatPrice(reservation.deposit_eur)}`,
              ].join(' · '),
            },
          },
        },
      ],
      metadata: {
        reservation_id: reservation.id,
      },
      // Le solde restant sera encaissé sur place.
      payment_intent_data: {
        metadata: { reservation_id: reservation.id },
        description: `Söma · ${reservation.ritual_name} · ${reservation.guest_first_name} ${reservation.guest_last_name}`,
      },
      success_url: `${appUrl}/reservation/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/reservation?cancelled=1`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,  // 30 min
    })
  } catch (err) {
    console.error('[/api/checkout] Stripe error:', err)
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement. Réessayez.' },
      { status: 500 },
    )
  }

  // ── Mettre à jour la réservation avec l'ID de session ────────────────────
  await getSupabaseAdmin()
    .from('reservations')
    .update({ stripe_session_id: session.id })
    .eq('id', reservationId)

  return NextResponse.json({ url: session.url }, { status: 200 })
}
