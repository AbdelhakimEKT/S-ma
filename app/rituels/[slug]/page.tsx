import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { rituals, getRitualBySlug } from '@/data/rituals'
import { formatDuration, formatPrice } from '@/lib/utils'

export function generateStaticParams() {
  return rituals.map((r) => ({ slug: r.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getRitualBySlug(params.slug)
  if (!r) return { title: 'Rituel introuvable' }
  return {
    title: r.name,
    description: r.tagline,
  }
}

export default function RitualDetailPage({ params }: { params: { slug: string } }) {
  const ritual = getRitualBySlug(params.slug)
  if (!ritual) notFound()

  const others = rituals.filter((r) => r.slug !== ritual.slug).slice(0, 3)

  return (
    <>
      <PageHeader
        kicker={`Rituel · ${ritual.category}`}
        title={ritual.name}
        titleItalicTail={ritual.tagline.split('.')[0] + '.'}
        description={ritual.description}
        image={ritual.detailImage ?? ritual.image}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <div className="eyebrow text-bone-500">Durée</div>
            <div className="mt-1 font-serif text-xl text-bone-100">{formatDuration(ritual.duration)}</div>
          </div>
          <div className="h-8 w-px bg-bone-400/30" />
          <div>
            <div className="eyebrow text-bone-500">{ritual.perGroup ? 'Tarif maison' : 'Par personne'}</div>
            <div className="mt-1 font-serif text-xl text-bone-100">{formatPrice(ritual.price)}</div>
          </div>
          <div className="h-8 w-px bg-bone-400/30" />
          <div>
            <div className="eyebrow text-bone-500">Jusqu'à</div>
            <div className="mt-1 font-serif text-xl text-bone-100">
              {ritual.maxGuests} {ritual.maxGuests > 1 ? 'personnes' : 'personne'}
            </div>
          </div>
          <Button href={`/reservation?ritual=${ritual.slug}`} variant="primary" size="lg" dot className="ml-auto">
            Réserver ce rituel
          </Button>
        </div>
      </PageHeader>

      {/* Long narrative */}
      {ritual.longDescription && (
        <section className="section">
          <div className="container grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow text-bone-500">À propos</p>
              <h2 className="mt-4 font-serif text-display-md leading-[1.02] text-bone-100">
                Notre approche.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-pretty text-[17px] leading-[1.85] text-bone-300">
                {ritual.longDescription}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <Divider label="Le déroulé" className="container" />

      {/* Steps */}
      <section className="section pt-20">
        <div className="container">
          <ol className="relative grid gap-12 border-l border-[var(--line)] pl-8 md:pl-12">
            {ritual.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="relative">
                <span className="absolute -left-[calc(2rem+1px)] md:-left-[calc(3rem+1px)] top-2 h-1.5 w-1.5 rounded-full bg-ember-500" />
                <div className="grid gap-6 md:grid-cols-[120px_1fr] md:items-baseline">
                  <span className="font-serif text-xs uppercase tracking-wide-2 text-bone-500">
                    Étape {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl text-bone-100 md:text-3xl">{s.title}</h3>
                    <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-bone-400">
                      {s.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Included */}
      <section className="section">
        <div className="container">
          <div className="surface rounded-sm p-10 md:p-14">
            <p className="eyebrow mb-6 text-bone-500">Compris dans le rituel</p>
            <RevealGroup className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              {ritual.included.map((item) => (
                <Reveal key={item}>
                  <div className="flex items-baseline gap-3 border-b border-[var(--line)] pb-3 text-bone-200">
                    <span className="h-1 w-1 rounded-full bg-ember-500" />
                    <span className="font-serif text-lg">{item}</span>
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Image break */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={ritual.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
      </section>

      {/* Other rituals */}
      <section className="section">
        <div className="container">
          <div className="mb-12 flex items-end justify-between gap-6">
            <h2 className="font-serif text-display-md text-bone-100">D'autres rituels.</h2>
            <Button href="/rituels" variant="ghost">Voir tous les rituels</Button>
          </div>
          <RevealGroup className="grid gap-8 md:grid-cols-3">
            {others.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.1}>
                <Link href={`/rituels/${r.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-bone-100">{r.name}</h3>
                  <p className="mt-2 text-[14.5px] text-bone-400">{r.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  )
}
