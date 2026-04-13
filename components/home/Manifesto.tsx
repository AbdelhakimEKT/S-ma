'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'

/**
 * Manifeste — un texte long, traité comme un bloc éditorial.
 * Image à droite qui "émerge" lentement, grande typographie à gauche,
 * colonne d'indices en bas.
 */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })

  // Slow parallax on the image panel.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1])
  const imageBlur = useTransform(scrollYProgress, [0, 0.35], ['8px', '0px'])

  return (
    <section ref={ref} className="section relative halo">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 xl:gap-28">
          {/* Text column */}
          <div className="relative">
            <Reveal className="eyebrow mb-10 flex items-center gap-4 text-bone-500">
              <span className="h-px w-10 bg-bone-500/60" />
              <span>Notre maison · Orléans</span>
            </Reveal>

            <h2 className="font-serif text-display-lg leading-[0.98] text-bone-100">
              <SplitText
                text="Un lieu discret,"
                as="span"
                className="block"
                stagger={0.05}
                duration={1}
              />
              <SplitText
                text="fait pour"
                as="span"
                className="block"
                stagger={0.05}
                duration={1}
                delay={0.1}
              />
              <SplitText
                text="le silence."
                as="span"
                className="block italic text-bone-300"
                stagger={0.05}
                duration={1}
                delay={0.2}
              />
            </h2>

            <RevealGroup className="mt-12 max-w-[52ch] space-y-6 text-[17px] leading-[1.75] text-bone-300" stagger={0.12}>
              <Reveal>
                <p>
                  Nous avons ouvert Söma en 2019 parce qu'il manquait à Orléans
                  un endroit sans musique forte, sans écran, sans précipitation.
                  Un endroit où l'on puisse simplement avoir chaud, boire une
                  infusion, et regarder la vapeur tomber pendant deux heures.
                </p>
              </Reveal>
              <Reveal>
                <p>
                  Tout ici est fait pour ralentir : la lumière est basse mais
                  jamais noire, les températures sont pensées au demi-degré
                  près, la vaisselle est en grès, les serviettes pèsent. Nous
                  n'écrivons jamais nos tarifs sur les murs, et nos praticiennes
                  ne vous vendront jamais rien.
                </p>
              </Reveal>
              <Reveal>
                <p className="text-bone-200">
                  Vous n'avez rien à faire ici, sinon vous déposer.
                </p>
              </Reveal>
            </RevealGroup>

            {/* Small signature */}
            <Reveal className="mt-14 flex items-center gap-4" delay={0.4}>
              <span className="h-px w-10 bg-ember-500/60" />
              <span className="font-serif text-sm italic text-bone-400">
                Inès & Karim, Söma
              </span>
            </Reveal>
          </div>

          {/* Image column */}
          <div className="relative">
            <motion.div
              style={{ y: imageY, scale: imageScale, filter: useTransform(imageBlur, (b) => `blur(${b})`) }}
              className="relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=85"
                alt="Salle de repos de la maison, lumière basse"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
            </motion.div>

            {/* Small overlay card */}
            <Reveal
              delay={0.4}
              className="absolute -bottom-6 left-0 max-w-[240px] surface rounded-sm p-5 backdrop-blur-md sm:-left-6 md:-left-12"
            >
              <div className="eyebrow mb-2 text-bone-500">Depuis 2019</div>
              <p className="font-serif text-xl leading-tight text-bone-100">
                Six praticien·nes, une maîtresse des lieux, un chat.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Stat ribbon — small, right-aligned */}
        <div className="mt-24 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div>
                <div className="font-serif text-4xl text-bone-100">{s.value}</div>
                <div className="mt-2 text-xs text-bone-500 uppercase tracking-wide-1">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const stats = [
  { value: '45°', label: 'Température de la salle chaude' },
  { value: '90 min', label: 'Durée minimale conseillée' },
  { value: '6', label: 'Praticien·nes formé·es' },
  { value: '0', label: 'Téléphone dans les salles' },
]
