'use client'

import Image from 'next/image'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ReservationProvider } from '@/components/reservation/ReservationContext'
import ReservationFlow from '@/components/reservation/ReservationFlow'
import { Reveal } from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import { ease } from '@/lib/motion'

export default function ReservationPageClient({
  initialRitualSlug,
  cancelled = false,
}: {
  initialRitualSlug?: string
  cancelled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imageY     = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12])

  return (
    <ReservationProvider initialRitualSlug={initialRitualSlug}>
      {/* Hero compact */}
      <section ref={ref} className="relative min-h-[58vh] overflow-hidden md:min-h-[62vh]">
        <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/40 to-ink-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent,rgba(12,10,8,0.7))]" />
        </motion.div>

        <div className="container relative z-10 flex min-h-[58vh] flex-col justify-end pb-16 pt-[calc(var(--header-h)+4rem)] md:min-h-[62vh]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.2 }}
            className="mb-8 flex items-center gap-4 text-bone-400"
          >
            <span className="h-px w-10 bg-ember-500/70" />
            <span className="eyebrow text-bone-300">Réservation</span>
          </motion.div>

          <h1 className="font-serif text-display-lg leading-[0.96] text-bone-100">
            <SplitText text="Quelques" as="span" className="block" stagger={0.05} delay={0.3} />
            <SplitText text="minutes" as="span" className="block" stagger={0.05} delay={0.42} />
            <SplitText text="pour ralentir." as="span" className="block italic text-bone-300" stagger={0.05} delay={0.54} />
          </h1>

          <Reveal delay={0.9} className="mt-8 max-w-lg text-pretty text-[15.5px] leading-relaxed text-bone-300">
            Choisissez votre rituel, sélectionnez une date et un créneau, laissez
            vos coordonnées. Un acompte de 30 % est demandé pour confirmer votre
            place — le solde se règle sur place, le jour de votre venue.
          </Reveal>
        </div>
      </section>

      {/* Bannière d'annulation */}
      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: ease.out }}
            className="border-b border-ember-500/30 bg-ember-500/10 px-4 py-4 text-center text-[13.5px] text-bone-200"
          >
            Vous avez interrompu le paiement — votre créneau n'est pas encore réservé.
            Reprenez ci-dessous pour recommencer.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow de réservation */}
      <section className="section">
        <div className="container max-w-5xl">
          <ReservationFlow />
        </div>
      </section>
    </ReservationProvider>
  )
}
