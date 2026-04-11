import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReservationPageClient from './ReservationPageClient'

export const metadata: Metadata = {
  title: 'Réserver un rituel',
  description: 'Réservez votre rituel à la maison Söma à Orléans en quelques minutes.',
}

export default function ReservationPage({
  searchParams,
}: {
  searchParams?: { ritual?: string; cancelled?: string }
}) {
  return (
    <Suspense>
      <ReservationPageClient
        initialRitualSlug={searchParams?.ritual}
        cancelled={searchParams?.cancelled === '1'}
      />
    </Suspense>
  )
}
