'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import { testimonials } from '@/data/testimonials'
import { ease } from '@/lib/motion'

/**
 * Témoignages — un seul visible à la fois, avec rotation lente.
 * Manipulable au clavier, met en pause au hover.
 */
export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(id)
  }, [paused])

  const current = testimonials[index]!

  return (
    <section
      className="section relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <Reveal className="eyebrow mb-10 flex items-center gap-4 text-bone-500">
          <span className="h-px w-10 bg-bone-500/60" />
          On nous a dit
        </Reveal>

        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="relative min-h-[260px] md:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.9, ease: ease.out }}
                className="max-w-[44ch] font-serif text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.15] text-bone-100"
              >
                <span className="relative">
                  <span className={'absolute -top-6 -left-4 font-serif text-6xl text-ember-500/40 select-none sm:-left-8'}>
                    “
                  </span>
                  {current.quote}
                </span>
                <footer className="mt-8 font-sans text-[13px] uppercase tracking-wide-1 text-bone-500">
                  {current.name} — {current.city} · {current.ritual}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              aria-label="Témoignage précédent"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] text-bone-300 hover:text-bone-100 hover:border-bone-400/40 transition-all duration-600 ease-soma"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" className="-scale-x-100">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Témoignage ${i + 1}`}
                  className="group relative h-1.5 w-6 overflow-hidden rounded-full bg-bone-100/10"
                >
                  <span
                    className={`absolute inset-0 origin-left bg-ember-500 transition-transform duration-900 ease-soma ${
                      i === index ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              aria-label="Témoignage suivant"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] text-bone-300 hover:text-bone-100 hover:border-bone-400/40 transition-all duration-600 ease-soma"
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
