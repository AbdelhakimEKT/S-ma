import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import { rituals } from '@/data/rituals'
import { formatDuration, formatPrice } from '@/lib/utils'
import type { RitualCategory } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Rituels',
  description: 'Hammam, soins, rituels en duo, privatisations. Le catalogue complet de la maison Söma à Orléans.',
}

const categoryLabels: Record<RitualCategory, string> = {
  signature: 'Signature',
  hammam: 'Hammam',
  soin: 'Soins',
  duo: 'En duo',
  privatisation: 'Privatisation',
}

export default function RitualsPage() {
  const grouped = rituals.reduce<Record<RitualCategory, typeof rituals>>(
    (acc, r) => {
      ;(acc[r.category] ||= []).push(r)
      return acc
    },
    {} as Record<RitualCategory, typeof rituals>,
  )

  const order: RitualCategory[] = ['signature', 'hammam', 'soin', 'duo', 'privatisation']

  return (
    <>
      <PageHeader
        kicker="Rituels & soins"
        title="Sept rituels,"
        titleItalicTail="une seule lenteur."
        description="Du hammam traditionnel au rituel signature de deux heures et demie, chaque expérience est conçue pour vous laisser le temps. Les prix sont nets, le matériel est compris, les pourboires ne sont jamais attendus."
        image="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&w=2400&q=85"
      />

      {order.map((cat, ci) => {
        const list = grouped[cat] ?? []
        if (list.length === 0) return null
        return (
          <section key={cat} className="section">
            <div className="container">
              <Divider label={categoryLabels[cat]} className="mb-16" />
              <RevealGroup className="grid gap-x-8 gap-y-16 md:grid-cols-2">
                {list.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 0.08} className={i % 2 === 1 && ci % 2 === 0 ? 'md:mt-20' : ''}>
                    <Link href={`/rituels/${r.slug}`} className="group block">
                      <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
                        <Image
                          src={r.image}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
                      </div>
                      <div className="mt-6 flex items-start justify-between gap-6">
                        <div>
                          <h3 className="font-serif text-3xl leading-tight text-bone-100 group-hover:text-bone-50 transition-colors duration-600">
                            {r.name}
                          </h3>
                          <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-bone-400">
                            {r.tagline}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="font-serif text-xl text-bone-100">{formatPrice(r.price)}</div>
                          <div className="text-xs text-bone-500">{formatDuration(r.duration)}</div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </RevealGroup>
            </div>
          </section>
        )
      })}
    </>
  )
}
