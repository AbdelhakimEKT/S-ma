'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'

/**
 * CTA final — grand bloc typographique sur image sombre, avec un léger
 * zoom lent à l'entrée et un double appel à l'action.
 */
export default function Cta() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['4%', '-4%'])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ scale, y }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=85"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/30" />
      </motion.div>

      <div className="container relative py-section text-center">
        <Reveal className="eyebrow mb-8 text-bone-500">
          Prendre rendez-vous
        </Reveal>

        <h2 className="mx-auto max-w-[16ch] font-serif text-display-lg leading-[0.98] text-bone-100">
          <SplitText
            text="Offrez-vous"
            as="span"
            className="block"
            stagger={0.05}
          />
          <SplitText
            text="un moment"
            as="span"
            className="block"
            stagger={0.05}
            delay={0.08}
          />
          <SplitText
            text="pour rien."
            as="span"
            className="block italic text-bone-300"
            stagger={0.05}
            delay={0.16}
          />
        </h2>

        <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/reservation" variant="primary" size="lg" dot>
            Réserver un rituel
          </Button>
          <Button href="/cadeaux" variant="outline" size="lg">
            Offrir un bon cadeau
          </Button>
        </Reveal>

        <Reveal delay={0.55} className="mt-10 text-[13px] text-bone-500">
          Mardi au dimanche — 12 rue des Carmes, Orléans
        </Reveal>
      </div>
    </section>
  )
}
