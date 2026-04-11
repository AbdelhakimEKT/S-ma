'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import { faq } from '@/data/faq'
import type { FAQItem } from '@/lib/types'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const categoryLabels: Record<FAQItem['category'], string> = {
  rituels: 'Rituels & soins',
  pratique: 'Côté pratique',
  cadeaux: 'Bons cadeaux',
  annulation: 'Annulation',
}

export default function FAQPage() {
  const grouped = faq.reduce<Record<FAQItem['category'], FAQItem[]>>(
    (acc, q) => {
      ;(acc[q.category] ||= []).push(q)
      return acc
    },
    {} as Record<FAQItem['category'], FAQItem[]>,
  )

  const order: FAQItem['category'][] = ['rituels', 'pratique', 'cadeaux', 'annulation']

  return (
    <>
      <PageHeader
        kicker="Questions fréquentes"
        title="Tout ce que"
        titleItalicTail="vous voulez savoir."
        description="Nous avons rassemblé ici les questions qu'on nous pose le plus souvent. Si la vôtre n'y est pas, le téléphone reste le moyen le plus simple."
        image="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=2400&q=85"
      />

      {order.map((cat, ci) => {
        const items = grouped[cat] ?? []
        if (items.length === 0) return null
        return (
          <section key={cat} className={cn('section', ci > 0 && 'pt-0')}>
            <div className="container max-w-3xl">
              <Divider label={categoryLabels[cat]} className="mb-12" />
              <ul className="space-y-3">
                {items.map((q, i) => (
                  <Reveal key={q.question} delay={i * 0.04}>
                    <FAQRow item={q} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        )
      })}
    </>
  )
}

function FAQRow({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-b border-[var(--line)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
      >
        <span className="font-serif text-xl text-bone-100 group-hover:text-bone-50 transition-colors duration-600 md:text-2xl">
          {item.question}
        </span>
        <span
          className={cn(
            'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-bone-300 transition-all duration-600 ease-soma',
            open ? 'rotate-45 border-ember-500/60 text-ember-500' : '',
          )}
          aria-hidden
        >
          <span className="absolute h-px w-3 bg-current" />
          <span className="absolute h-3 w-px bg-current" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-7 text-[15.5px] leading-relaxed text-bone-400">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
