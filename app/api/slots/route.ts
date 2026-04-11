/**
 * GET /api/slots?ritual=xxx&date=YYYY-MM-DD
 *
 * Retourne tous les créneaux de la journée avec leur disponibilité.
 * La logique tient compte des réservations existantes en Supabase
 * et des horaires d'ouverture de la maison.
 *
 * Modèle : 1 salon / 1 cabine — pas de créneaux en parallèle.
 */

import { NextResponse } from 'next/server'
import { getRitualBySlug } from '@/data/rituals'
import { getSlotsForDate } from '@/lib/availability'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ritualSlug = searchParams.get('ritual')
  const date       = searchParams.get('date')

  if (!ritualSlug || !date) {
    return NextResponse.json({ error: 'ritual et date sont requis.' }, { status: 400 })
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Format de date invalide.' }, { status: 400 })
  }

  const ritual = getRitualBySlug(ritualSlug)
  if (!ritual) {
    return NextResponse.json({ error: 'Rituel introuvable.' }, { status: 404 })
  }

  try {
    const slots = await getSlotsForDate(ritual.duration, date)
    return NextResponse.json({ slots }, { status: 200 })
  } catch (err) {
    console.error('[/api/slots]', err)
    return NextResponse.json(
      { error: 'Impossible de charger les créneaux. Réessayez.' },
      { status: 500 },
    )
  }
}
