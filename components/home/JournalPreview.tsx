import Image from 'next/image'
import Link from 'next/link'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import SplitText from '@/components/ui/SplitText'
import { journal } from '@/data/journal'
import { formatDateFull } from '@/lib/utils'

/**
 * Aperçu du journal — trois entrées, trois formats différents, rien d'aligné.
 */
export default function JournalPreview() {
  const entries = journal.slice(0, 3)

  return (
    <section className="section relative">
      <div className="container">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="eyebrow mb-6 flex items-center gap-4 text-bone-500">
              <span className="h-px w-10 bg-bone-500/60" />
              Journal
            </Reveal>
            <h2 className="font-serif text-display-lg leading-[0.98] text-bone-100">
              <SplitText text="Un carnet," as="span" className="block" stagger={0.05} />
              <SplitText text="plus qu'un blog." as="span" className="block italic text-bone-300" stagger={0.05} delay={0.1} />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <Button href="/journal" variant="ghost">Lire tout le journal</Button>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {entries.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.1}>
              <Link href={`/journal/${e.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-3 text-[11px] uppercase tracking-wide-1 text-bone-500">
                    <span>{e.kicker}</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <span>{e.readingTime} min</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <time dateTime={e.date}>{formatDateFull(new Date(e.date))}</time>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-bone-100 group-hover:text-bone-50 transition-colors duration-600">
                    {e.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-[14.5px] leading-relaxed text-bone-400">
                    {e.excerpt}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
