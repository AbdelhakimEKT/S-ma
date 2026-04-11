import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { rituals } from '@/data/rituals'
import { experiences } from '@/data/experiences'
import { formatDuration, formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: "Les tarifs détaillés des rituels et formules de la maison Söma à Orléans.",
}

export default function TarifsPage() {
  return (
    <>
      <PageHeader
        kicker="Tarifs"
        title="Des prix nets,"
        titleItalicTail="pas de surprises."
        description="Tous nos tarifs sont en euros, TTC, par personne sauf mention contraire. Le matériel (peignoir, mules, serviette, savon noir, infusions) est compris. Les pourboires ne sont jamais attendus."
        image="https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=2400&q=85"
      />

      {/* Featured experiences */}
      <section className="section">
        <div className="container">
          <Divider label="Formules conseillées" className="mb-16" />
          <RevealGroup className="grid gap-8 md:grid-cols-3">
            {experiences.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.1}>
                <div className="surface relative flex h-full flex-col rounded-sm p-8">
                  <div className="eyebrow mb-2 text-bone-500">{e.kicker}</div>
                  <h3 className="font-serif text-3xl leading-tight text-bone-100">{e.name}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-bone-400">{e.description}</p>
                  <ul className="mt-8 space-y-2 text-[14px] text-bone-300">
                    {e.highlights.map((h) => (
                      <li key={h} className="flex items-baseline gap-3">
                        <span className="h-1 w-1 rounded-full bg-ember-500" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-6">
                      <div>
                        <div className="eyebrow text-bone-500">À partir de</div>
                        <div className="font-serif text-3xl text-bone-100">{formatPrice(e.priceFrom)}</div>
                      </div>
                      <div className="text-xs text-bone-500">{formatDuration(e.duration)}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Full price list */}
      <section className="section">
        <div className="container">
          <Divider label="Tous les rituels" className="mb-16" />
          <Reveal>
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {rituals.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/rituels/${r.slug}`}
                    className="group grid grid-cols-1 items-baseline gap-y-2 py-7 md:grid-cols-[1.4fr_1fr_auto_auto] md:items-center md:gap-x-10"
                  >
                    <div>
                      <div className="font-serif text-2xl text-bone-100 group-hover:text-bone-50 transition-colors duration-600 md:text-3xl">
                        {r.name}
                      </div>
                      <div className="mt-1 text-[13px] text-bone-500">{r.tagline}</div>
                    </div>
                    <div className="hidden text-[13px] uppercase tracking-wide-1 text-bone-500 md:block">
                      {r.category}
                    </div>
                    <div className="text-[13px] text-bone-400 md:text-right">
                      {formatDuration(r.duration)}
                    </div>
                    <div className="font-serif text-2xl text-bone-100 md:text-right">
                      {formatPrice(r.price)}
                      {r.perGroup && <span className="ml-2 text-[11px] text-bone-500">/ groupe</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Notes */}
      <section className="section">
        <div className="container max-w-3xl">
          <Divider label="Bon à savoir" className="mb-12" />
          <RevealGroup className="space-y-7 text-[15.5px] leading-relaxed text-bone-400" stagger={0.1}>
            <Reveal>
              <p>
                <span className="text-bone-200">Annulation jusqu'à 48 heures avant.</span>{' '}
                Aucune retenue. Au-delà, la moitié du montant est conservée. Moins
                de 24 heures, l'intégralité — sauf cas évidents que nous traitons
                à la main, avec bienveillance.
              </p>
            </Reveal>
            <Reveal>
              <p>
                <span className="text-bone-200">Mineurs.</span> Les rituels sont
                ouverts à partir de 16 ans, accompagnés d'un adulte. Pour les
                plus jeunes, nous avons un créneau « bains courts » le samedi
                matin, à réserver par téléphone.
              </p>
            </Reveal>
            <Reveal>
              <p>
                <span className="text-bone-200">Grossesse.</span> Certains soins
                sont compatibles à partir du deuxième trimestre, d'autres non
                (notamment le hammam). Nous proposons un parcours adapté —
                appelez-nous, on en parle.
              </p>
            </Reveal>
            <Reveal>
              <p>
                <span className="text-bone-200">Bons cadeaux.</span> Disponibles
                en carte papier ou en PDF, valides un an à compter de l'achat.
                Voir la page dédiée.
              </p>
            </Reveal>
          </RevealGroup>
          <Reveal delay={0.4} className="mt-12 flex flex-wrap items-center gap-4">
            <Button href="/reservation" variant="primary" dot>Réserver</Button>
            <Button href="/cadeaux" variant="outline">Bons cadeaux</Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
