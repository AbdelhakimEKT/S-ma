import type { Metadata } from 'next'
import Image from 'next/image'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { rituals } from '@/data/rituals'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Bons cadeaux',
  description: "Offrez un rituel à la maison Söma. Cartes papier ou PDF, valides un an.",
}

const cardOptions = [
  { value: 90, label: 'Hammam court', tag: 'Le geste léger' },
  { value: 150, label: 'Soin libre', tag: 'Au choix' },
  { value: 200, label: 'Rituel signature', tag: 'Le grand temps' },
  { value: 300, label: 'Duo Lune', tag: 'À deux' },
]

export default function CadeauxPage() {
  return (
    <>
      <PageHeader
        kicker="Bons cadeaux"
        title="Offrir,"
        titleItalicTail="à voix basse."
        description="Un bon cadeau Söma, c'est une carte de papier coton, glissée dans une enveloppe en lin, avec un mot écrit à la main. La version PDF existe aussi — moins belle, plus rapide."
        image="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&w=2400&q=85"
      />

      {/* Cards grid */}
      <section className="section">
        <div className="container">
          <Divider label="Choisir un montant" className="mb-16" />
          <RevealGroup className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {cardOptions.map((c, i) => (
              <Reveal key={c.value} delay={i * 0.08}>
                <article className="group relative flex h-full flex-col rounded-sm border border-[var(--line)] bg-gradient-to-br from-bone-100/[0.04] to-bone-100/[0.01] p-8 transition-all duration-900 ease-soma hover:border-ember-500/40 hover:from-bone-100/[0.06]">
                  {/* Embossed shape */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-ember-500/15 transition-transform duration-900 ease-soma group-hover:scale-110" />
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ember-500/[0.06] blur-xl transition-opacity duration-900 ease-soma group-hover:opacity-150" />

                  <div className="relative">
                    <p className="eyebrow text-bone-500">{c.tag}</p>
                    <div className="mt-8 font-serif text-5xl text-bone-100">{formatPrice(c.value)}</div>
                    <div className="mt-2 text-sm text-bone-400">{c.label}</div>
                  </div>

                  <div className="relative mt-auto pt-10">
                    <Button href="/contact" variant="outline" size="sm" className="w-full justify-between">
                      Offrir
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Or by ritual */}
      <section className="section">
        <div className="container">
          <Divider label="Ou un rituel précis" className="mb-16" />
          <RevealGroup className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {rituals.slice(0, 6).map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.07}>
                <div className="group flex items-start gap-5 border-b border-[var(--line)] pb-6">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-bone-100">{r.name}</h3>
                    <p className="mt-1 text-[13px] text-bone-500">{r.tagline}</p>
                  </div>
                  <div className="text-right font-serif text-lg text-bone-100">
                    {formatPrice(r.price)}
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container max-w-4xl">
          <Divider label="Comment ça marche" className="mb-16" />
          <ol className="grid gap-12 md:grid-cols-3">
            {[
              { i: '01', t: 'Vous choisissez', b: 'Un montant ou un rituel précis. On vous confirme tout par mail dans la demi-heure.' },
              { i: '02', t: 'Nous préparons', b: "Carte coton, enveloppe lin, mot manuscrit. Si c'est urgent, on vous envoie aussi le PDF." },
              { i: '03', t: "C'est offert", b: "Validité un an à compter de l'achat. Réservation en ligne ou par téléphone, avec le code de la carte." },
            ].map((s, i) => (
              <Reveal key={s.i} delay={i * 0.1}>
                <div className="border-l border-[var(--line)] pl-6">
                  <div className="font-serif text-xs uppercase tracking-wide-2 text-bone-500">{s.i}</div>
                  <h3 className="mt-3 font-serif text-2xl text-bone-100">{s.t}</h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-bone-400">{s.b}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.4} className="mt-16 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="primary" dot>Commander un bon cadeau</Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
