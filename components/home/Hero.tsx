'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SplitText from '@/components/ui/SplitText'
import Button from '@/components/ui/Button'
import Magnetic from '@/components/ui/Magnetic'
import { ease } from '@/lib/motion'

/**
 * Home hero.
 *
 * Composition: a single enveloping image, a slow-breathing warm halo behind
 * the title, a masked serif headline built from SplitText, and two quiet
 * CTAs. Scroll drives a discreet parallax on the image and opacity on the
 * content — nothing violent.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Very subtle parallax + a gentle darken on scroll-out.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[100vh] overflow-hidden">
      {/* Background image */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Double-layer vignette for warmth and depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,transparent_10%,rgba(12,10,8,0.55)_60%,rgba(12,10,8,0.95)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-ink-900" />
      </motion.div>

      {/* Warm breathing halo behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[70vh] w-[90vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 ember-breath"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 flex min-h-[100vh] flex-col justify-end pb-24 pt-[calc(var(--header-h)+4rem)]"
      >
        <div className="max-w-[18ch]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.4 }}
            className="mb-8 flex items-center gap-4 text-bone-400"
          >
            <span className="h-px w-10 bg-ember-500/70" />
            <span className="eyebrow text-bone-300">Orléans · Depuis 2019</span>
          </motion.div>

          <h1 className="font-serif text-display-xl leading-[0.92] text-bone-100">
            <SplitText
              text="Ici, le"
              as="span"
              className="block italic font-light"
              stagger={0.06}
              duration={1.1}
              delay={0.3}
            />
            <SplitText
              text="temps"
              as="span"
              className="block font-light"
              stagger={0.06}
              duration={1.1}
              delay={0.45}
            />
            <SplitText
              text="ralentit."
              as="span"
              className="block italic font-light"
              stagger={0.06}
              duration={1.1}
              delay={0.6}
            />
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: ease.out, delay: 1.3 }}
          className="mt-10 max-w-md text-pretty text-[17px] leading-relaxed text-bone-300"
        >
          Söma est une maison de rituels au cœur d'Orléans. Hammam traditionnel,
          bains chauds, soins lents — pensée pour que vous n'ayez rien à faire
          ici, sinon vous y déposer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: ease.out, delay: 1.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Button href="/reservation" variant="primary" size="lg" dot>
              Réserver un rituel
            </Button>
          </Magnetic>
          <Button href="/lieu" variant="ghost" size="lg">
            Découvrir la maison
          </Button>
        </motion.div>

        {/* Bottom meta row — small but present */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: ease.out, delay: 2 }}
          className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--line)] pt-6 text-[13px] text-bone-400"
        >
          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500 shadow-[0_0_10px_rgba(220,176,132,0.6)]" />
            <span>Ouvert ce soir jusqu'à 22 h</span>
          </div>
          <div className="hidden items-center gap-6 text-bone-500 md:flex">
            <span>12 rue des Carmes, 45000 Orléans</span>
            <span className="h-3 w-px bg-bone-500/40" />
            <span>3 min de la cathédrale</span>
          </div>
          <ScrollHint />
        </motion.div>
      </motion.div>
    </section>
  )
}

function ScrollHint() {
  return (
    <div className="flex items-center gap-3 text-bone-500">
      <span className="text-[11px] uppercase tracking-wide-1">Faire défiler</span>
      <motion.span
        aria-hidden
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
        className="relative block h-8 w-px bg-bone-500/40"
      />
    </div>
  )
}
