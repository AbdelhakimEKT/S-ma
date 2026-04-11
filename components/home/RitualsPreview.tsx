'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import Marquee from '@/components/ui/Marquee'
import SplitText from '@/components/ui/SplitText'
import { rituals } from '@/data/rituals'
import { formatDuration, formatPrice } from '@/lib/utils'
import { ease } from '@/lib/motion'

/**
 * Aperçu des rituels sur la home.
 *
 * Grille asymétrique de cartes, plus une ligne défilante (marquee) qui
 * reprend les noms des rituels comme un bandeau typographique lent.
 */
export default function RitualsPreview() {
  const featured = rituals.slice(0, 4)

  return (
    <section className="section relative overflow-hidden">
      {/* Marquee ribbon */}
      <div className="py-10 border-y border-[var(--line)]">
        <Marquee duration={60}>
          {rituals.map((r) => (
            <span
              key={r.slug}
              className="inline-flex items-center gap-10 font-serif text-[10vw] leading-none tracking-tight-2 text-bone-100/[0.08]"
            >
              {r.name}
              <span className="inline-block h-2 w-2 rounded-full bg-ember-500/50" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container pt-section">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Reveal className="eyebrow mb-6 flex items-center gap-4 text-bone-500">
              <span className="h-px w-10 bg-bone-500/60" />
              Nos rituels
            </Reveal>
            <h2 className="font-serif text-display-lg leading-[0.98] text-bone-100">
              <SplitText
                text="Sept façons"
                as="span"
                className="block"
                stagger={0.05}
              />
              <SplitText
                text="de ralentir."
                as="span"
                className="block italic text-bone-300"
                stagger={0.05}
                delay={0.1}
              />
            </h2>
          </div>
          <Reveal delay={0.2} className="max-w-sm text-[15px] leading-relaxed text-bone-400">
            <p>
              Du hammam traditionnel au rituel signature, chaque expérience est
              pensée comme une petite chorégraphie. Rythmes lents, pauses
              explicites, plateau de thé en guise de ponctuation.
            </p>
            <Button href="/rituels" variant="ghost" className="mt-6 -ml-2">
              Voir tous les rituels
            </Button>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
          {featured.map((r, i) => (
            <RitualCard key={r.slug} ritual={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Card ---------------------------------- */

function RitualCard({
  ritual,
  index,
}: {
  ritual: (typeof rituals)[number]
  index: number
}) {
  const [hover, setHover] = useState(false)

  // Asymmetric grid pattern.
  const span =
    index === 0
      ? 'lg:col-span-7 lg:row-span-2'
      : index === 1
      ? 'lg:col-span-5'
      : index === 2
      ? 'lg:col-span-5'
      : 'lg:col-span-7'

  const tall = index === 0 || index === 3

  return (
    <Reveal
      delay={index * 0.12}
      className={`group relative overflow-hidden rounded-sm border border-[var(--line)] ${span}`}
    >
      <Link
        href={`/rituels/${ritual.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative block h-full"
      >
        <div className={`relative ${tall ? 'aspect-[4/5] lg:aspect-[5/6]' : 'aspect-[16/11]'}`}>
          <motion.div
            animate={{ scale: hover ? 1.06 : 1 }}
            transition={{ duration: 1.4, ease: ease.out }}
            className="absolute inset-0"
          >
            <Image
              src={ritual.image}
              alt={ritual.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

          {/* Category pill */}
          <div className="absolute left-6 top-6 rounded-full border border-[var(--line-strong)] bg-ink-900/60 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wide-1 text-bone-300">
            {ritual.category}
          </div>

          {/* Label group */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl leading-tight text-bone-100 md:text-3xl">
                {ritual.name}
              </h3>
              <p className="mt-2 max-w-sm text-[13.5px] text-bone-400">
                {ritual.tagline}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[11px] uppercase tracking-wide-1 text-bone-500">
                À partir de
              </div>
              <div className="font-serif text-xl text-bone-100">
                {formatPrice(ritual.price)}
              </div>
              <div className="text-xs text-bone-500">{formatDuration(ritual.duration)}</div>
            </div>
          </div>

          {/* Hover caret */}
          <motion.div
            animate={{ x: hover ? 0 : -12, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-ember-500/60 bg-ink-900/60 backdrop-blur-md text-bone-100"
          >
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </Reveal>
  )
}
