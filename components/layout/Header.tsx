'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/utils'
import { ease } from '@/lib/motion'

/**
 * Site header.
 *
 * - Transparent on top of the hero, condensed once the page scrolls.
 * - Mobile menu slides in from the top, with a slow reveal sequence.
 * - Current page is underlined with a gilded rule.
 */
export default function Header() {
  const pathname = usePathname()
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setCondensed(v > 60)
  })

  // Lock scroll when mobile menu open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-[padding,background-color,backdrop-filter] duration-600 ease-soma',
          condensed
            ? 'py-4 bg-ink-900/70 backdrop-blur-md border-b border-[var(--line)]'
            : 'py-6 bg-transparent',
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="container flex items-center justify-between gap-8">
          <Link href="/" className="group relative z-10 flex items-center gap-3" aria-label="Söma — Accueil">
            <LogoMark className="h-8 w-8 text-bone-200 transition-transform duration-900 ease-soma group-hover:rotate-[8deg]" />
            <span className="font-serif text-xl tracking-tight-1 text-bone-200">
              Söma
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href.length > 1 && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-2 text-sm text-bone-300 hover:text-bone-100 transition-colors duration-400"
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      'absolute left-0 right-0 -bottom-0.5 h-px origin-left transition-transform duration-600 ease-soma',
                      active
                        ? 'bg-ember scale-x-100'
                        : 'bg-bone-400 scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/reservation"
              className="group relative inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] bg-bone-100/[0.02] px-5 py-2.5 text-sm text-bone-100 transition-all duration-600 ease-soma hover:bg-bone-100/[0.06] hover:border-ember-500/50"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember-500 transition-transform duration-900 ease-soma group-hover:scale-150" />
              <span>Réserver</span>
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)]"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3 w-4">
              <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="absolute left-0 right-0 top-0 h-px bg-bone-200"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out }}
                className="absolute left-0 right-0 bottom-0 h-px bg-bone-200"
              />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
            className="fixed inset-0 z-40 bg-ink-900/98 backdrop-blur-xl lg:hidden"
          >
            <div className="container flex h-full flex-col pt-[calc(var(--header-h)+2rem)] pb-10">
              <nav className="flex flex-col gap-4">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, ease: ease.out, delay: 0.1 + i * 0.07 }}
                  >
                    <Link
                      href={item.href}
                      className="block py-2 font-serif text-4xl tracking-tight-1 text-bone-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: ease.out, delay: 0.7 }}
                className="mt-auto space-y-4"
              >
                <Link
                  href="/reservation"
                  className="flex items-center justify-center gap-3 rounded-full border border-ember-500/60 bg-ember-500/10 px-6 py-4 text-bone-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                  <span>Réserver un rituel</span>
                </Link>
                <div className="flex items-center justify-between text-xs text-bone-500">
                  <a href={`tel:${site.contact.phone}`}>{site.contact.phoneDisplay}</a>
                  <span>{site.address.street}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Custom wordmark — a small, tempered symbol.
 * Three drops falling into a half-circle, like water into a basin.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M4 22 C 4 30, 12 36, 20 36 C 28 36, 36 30, 36 22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="13" cy="10" r="1.6" fill="currentColor" />
      <circle cx="20" cy="6" r="1.6" fill="currentColor" />
      <circle cx="27" cy="10" r="1.6" fill="currentColor" />
      <path d="M13 12 C 13 17, 15 19, 20 19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M27 12 C 27 17, 25 19, 20 19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M20 8 L 20 19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}
