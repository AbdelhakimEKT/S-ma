'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'

/**
 * "L'expérience" — un séquençage narratif de 5 moments.
 * Structure : un grand visuel à gauche qui dérive lentement au scroll, des
 * étapes numérotées à droite qui apparaissent les unes après les autres.
 */
const steps = [
  {
    index: '01',
    title: 'L\'arrivée',
    text: "Vous poussez la porte, déposez vos affaires au vestiaire, enfilez peignoir et mules. Une infusion est déjà prête pour vous à la salle d'accueil.",
  },
  {
    index: '02',
    title: 'La salle tiède',
    text: "Premier passage, chaleur basse, respiration lente. Rien à faire, sinon laisser le corps s'ouvrir.",
  },
  {
    index: '03',
    title: 'La salle chaude',
    text: "Vapeur à 45°C, parfumée au laurier. On s'allonge, on écoute. La pièce est sombre mais jamais noire.",
  },
  {
    index: '04',
    title: 'Le soin',
    text: "Gommage au savon noir, enveloppement, massage. Drapage continu, lumière basse, voix chuchotée.",
  },
  {
    index: '05',
    title: 'Le retour',
    text: "Salle de repos, infusion, tapis épais, coussins bas. Vous repartez quand la tête est revenue — pas avant.",
  },
]

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="section relative bg-ink-800 halo">
      <div className="container">
        <div className="mb-20 max-w-2xl">
          <Reveal className="eyebrow mb-6 flex items-center gap-4 text-bone-500">
            <span className="h-px w-10 bg-bone-500/60" />
            L'expérience
          </Reveal>
          <h2 className="font-serif text-display-lg leading-[0.98] text-bone-100">
            <SplitText
              text="Une chorégraphie"
              as="span"
              className="block"
              stagger={0.05}
            />
            <SplitText
              text="en cinq temps."
              as="span"
              className="block italic text-bone-300"
              stagger={0.05}
              delay={0.1}
            />
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Sticky image column */}
          <div className="relative lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:h-[72vh]">
            <motion.div
              style={{ y }}
              className="relative h-full min-h-[420px] overflow-hidden rounded-sm"
            >
              <Image
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=85"
                alt="Lumière basse sur la salle de repos"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-ink-900/50 via-transparent to-ink-900/30" />
              <div className="absolute inset-0 vignette" />
            </motion.div>

            {/* Floating caption */}
            <Reveal
              delay={0.3}
              className="absolute bottom-6 left-6 max-w-[260px] surface rounded-sm p-4"
            >
              <div className="eyebrow mb-1 text-bone-500">Note</div>
              <p className="font-serif text-[15px] italic leading-snug text-bone-200">
                « On n'écoute pas le temps qui passe. On l'écoute s'épaissir. »
              </p>
            </Reveal>
          </div>

          {/* Steps */}
          <ol className="relative flex flex-col gap-12 border-l border-[var(--line)] pl-8 lg:gap-16 lg:pl-12">
            {steps.map((s, i) => (
              <Reveal key={s.index} as="li" delay={i * 0.08}>
                <div className="relative">
                  <span className="absolute -left-[calc(2rem+1px)] lg:-left-[calc(3rem+1px)] top-2 flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-4 w-4 rounded-full bg-ember-500/15 blur-md" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-ember-500" />
                  </span>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[11px] tracking-wide-2 text-bone-500">
                      {s.index}
                    </span>
                    <h3 className="font-serif text-2xl text-bone-100 md:text-3xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-[50ch] text-[15.5px] leading-relaxed text-bone-400">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
