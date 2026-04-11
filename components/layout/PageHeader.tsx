'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import SplitText from '@/components/ui/SplitText'
import { ease } from '@/lib/motion'

/**
 * Page-level hero used by every secondary route. Image background, slow
 * parallax, a small kicker label above a generous serif title.
 *
 * Kept client-side because of the scroll-linked parallax; server pages
 * can still import and use it freely.
 */
export default function PageHeader({
  kicker,
  title,
  titleItalicTail,
  description,
  image,
  align = 'left',
  children,
}: {
  kicker: string
  title: string
  /** An optional italic fragment at the end of the title (appended on a new line). */
  titleItalicTail?: string
  description?: string
  image: string
  align?: 'left' | 'center'
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.1])

  return (
    <section
      ref={ref}
      className="relative min-h-[78vh] overflow-hidden md:min-h-[82vh]"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/40 to-ink-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_30%,transparent,rgba(12,10,8,0.65)_75%)]" />
      </motion.div>

      <div
        className={`container relative z-10 flex min-h-[78vh] flex-col pt-[calc(var(--header-h)+5rem)] pb-20 md:min-h-[82vh] ${
          align === 'center' ? 'items-center text-center' : 'justify-end'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: ease.out, delay: 0.3 }}
          className="mb-8 flex items-center gap-4 text-bone-400"
        >
          <span className="h-px w-10 bg-ember-500/70" />
          <span className="eyebrow text-bone-300">{kicker}</span>
        </motion.div>

        <h1
          className={`font-serif text-display-lg leading-[0.98] text-bone-100 ${
            align === 'center' ? 'max-w-[18ch]' : 'max-w-[20ch]'
          }`}
        >
          <SplitText text={title} as="span" className="block" stagger={0.05} duration={1} delay={0.2} />
          {titleItalicTail && (
            <SplitText
              text={titleItalicTail}
              as="span"
              className="block italic text-bone-300"
              stagger={0.05}
              duration={1}
              delay={0.35}
            />
          )}
        </h1>

        {description && (
          <Reveal
            delay={0.6}
            className={`mt-10 max-w-xl text-pretty text-[16.5px] leading-relaxed text-bone-300 ${
              align === 'center' ? 'mx-auto' : ''
            }`}
          >
            {description}
          </Reveal>
        )}

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}
