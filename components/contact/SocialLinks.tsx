'use client'

import { motion } from 'framer-motion'
import { site } from '@/data/site'

/** SVG Instagram — outline stroke */
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** SVG TikTok — filled */
function IconTikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

const icons = {
  Instagram: IconInstagram,
  TikTok: IconTikTok,
} as const

const card = {
  rest: { scale: 1 },
  hover: { scale: 1.015 },
}

const glow = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

/**
 * Deux cartes sociales (Instagram + TikTok) avec hover ember.
 * Server-safe data, Framer Motion pour les micro-interactions.
 */
export default function SocialLinks() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {site.socials.map((s) => {
        const Icon = icons[s.label as keyof typeof icons]
        if (!Icon) return null

        return (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={card}
            initial="rest"
            whileHover="hover"
            transition={{ duration: 0.4, ease: [0.25, 0, 0.1, 1] }}
            className="group relative flex flex-col gap-6 overflow-hidden surface rounded-sm p-8"
          >
            {/* Ember glow border */}
            <motion.span
              variants={glow}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-ember-500/50"
            />

            {/* Top row: icon + réseau */}
            <div className="flex items-center justify-between">
              <Icon className="h-8 w-8 text-bone-200 group-hover:text-ember-400 transition-colors duration-400" />
              <span className="eyebrow text-bone-500">{s.label}</span>
            </div>

            {/* Handle */}
            <div>
              <p className="font-serif text-2xl text-bone-100 md:text-3xl">
                {s.handle}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-bone-400">
                {s.description}
              </p>
            </div>

            {/* Arrow CTA */}
            <div className="flex items-center gap-2 text-[13px] text-bone-500 group-hover:text-ember-400 transition-colors duration-300">
              <span>Suivre</span>
              <svg
                className="h-3.5 w-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Large background icon — décoratif */}
            <Icon className="pointer-events-none absolute -bottom-4 -right-4 h-32 w-32 text-bone-100/[0.03]" />
          </motion.a>
        )
      })}
    </div>
  )
}
