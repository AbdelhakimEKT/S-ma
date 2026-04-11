import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import { journal, getJournalBySlug } from '@/data/journal'
import { formatDateFull } from '@/lib/utils'

export function generateStaticParams() {
  return journal.map((e) => ({ slug: e.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const e = getJournalBySlug(params.slug)
  if (!e) return { title: 'Article introuvable' }
  return {
    title: e.title,
    description: e.excerpt,
  }
}

export default function JournalEntryPage({ params }: { params: { slug: string } }) {
  const entry = getJournalBySlug(params.slug)
  if (!entry) notFound()

  const others = journal.filter((j) => j.slug !== entry.slug).slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-[calc(var(--header-h)+5rem)]">
        <div className="container max-w-3xl">
          <Reveal className="mb-8 flex items-center gap-4">
            <Link href="/journal" className="text-[12px] uppercase tracking-wide-1 text-bone-500 hover:text-bone-300 transition-colors duration-600">
              ← Journal
            </Link>
          </Reveal>

          <Reveal className="flex items-center gap-3 text-[11px] uppercase tracking-wide-1 text-bone-500">
            <span>{entry.kicker}</span>
            <span className="h-1 w-1 rounded-full bg-bone-500/60" />
            <span>{entry.readingTime} min de lecture</span>
            <span className="h-1 w-1 rounded-full bg-bone-500/60" />
            <time dateTime={entry.date}>{formatDateFull(new Date(entry.date))}</time>
          </Reveal>

          <h1 className="mt-6 font-serif text-display-md leading-[1.02] text-bone-100">
            <SplitText text={entry.title} as="span" className="block" stagger={0.045} />
          </h1>

          <Reveal delay={0.5} className="mt-8 flex items-center gap-4 text-bone-400">
            <span className="h-px w-10 bg-ember-500/60" />
            <span className="font-serif text-sm italic">{entry.author}</span>
          </Reveal>
        </div>
      </section>

      {/* Cover image */}
      <section className="container mt-16 max-w-5xl">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
            <Image
              src={entry.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900/40" />
          </div>
        </Reveal>
      </section>

      {/* Body */}
      <article className="section">
        <div className="container max-w-2xl">
          <RevealGroup className="space-y-7 text-pretty text-[17.5px] leading-[1.85] text-bone-300" stagger={0.1}>
            {entry.body.map((p, i) => (
              <Reveal key={i}>
                <p className={i === 0 ? 'first-letter:font-serif first-letter:text-6xl first-letter:leading-none first-letter:float-left first-letter:mr-3 first-letter:text-bone-100' : ''}>
                  {p}
                </p>
              </Reveal>
            ))}
          </RevealGroup>

          <Reveal delay={0.4} className="mt-16 border-t border-[var(--line)] pt-8 text-[14px] text-bone-500">
            <p className="font-serif italic">— {entry.author}, {formatDateFull(new Date(entry.date))}</p>
          </Reveal>
        </div>
      </article>

      <Divider label="Continuer à lire" className="container max-w-3xl" />

      <section className="section pt-20">
        <div className="container max-w-5xl">
          <RevealGroup className="grid gap-10 md:grid-cols-2">
            {others.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.1}>
                <Link href={`/journal/${e.slug}`} className="group block">
                  <div className="relative aspect-[5/3] overflow-hidden rounded-sm">
                    <Image
                      src={e.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-bone-100">{e.title}</h3>
                  <p className="mt-2 text-[14.5px] text-bone-400">{e.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>

          <div className="mt-16 text-center">
            <Button href="/journal" variant="ghost">Tout le journal</Button>
          </div>
        </div>
      </section>
    </>
  )
}
