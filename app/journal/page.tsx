import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import { journal } from '@/data/journal'
import { formatDateFull } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Journal',
  description: "Le journal de la maison Söma — carnets, matières, gestes.",
}

export default function JournalPage() {
  return (
    <>
      <PageHeader
        kicker="Journal · Carnets"
        title="Un carnet,"
        titleItalicTail="plus qu'un blog."
        description="On y écrit ce qu'on apprend en faisant tourner la maison. Les matières qu'on choisit, les gestes qu'on précise, les histoires de clientes qu'on a la chance d'écouter."
        image="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2400&q=85"
      />

      <section className="section">
        <div className="container">
          <RevealGroup className="grid gap-x-8 gap-y-20 md:grid-cols-2 lg:gap-y-28">
            {journal.map((e, i) => (
              <Reveal
                key={e.slug}
                delay={i * 0.08}
                className={i % 2 === 1 ? 'md:mt-24' : ''}
              >
                <Link href={`/journal/${e.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image
                      src={e.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-wide-1 text-bone-500">
                    <span>{e.kicker}</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <span>{e.readingTime} min</span>
                    <span className="h-1 w-1 rounded-full bg-bone-500/60" />
                    <time dateTime={e.date}>{formatDateFull(new Date(e.date))}</time>
                  </div>
                  <h2 className="mt-3 font-serif text-3xl leading-tight text-bone-100 group-hover:text-bone-50 transition-colors duration-600 md:text-4xl">
                    {e.title}
                  </h2>
                  <p className="mt-3 max-w-[48ch] text-[15.5px] leading-relaxed text-bone-400">
                    {e.excerpt}
                  </p>
                  <p className="mt-4 font-serif text-sm italic text-bone-500">— {e.author}</p>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  )
}
