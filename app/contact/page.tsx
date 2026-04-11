import type { Metadata } from 'next'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact & accès',
  description: "Adresse, horaires et contact de la maison Söma à Orléans.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact · Accès"
        title="Nous écrire,"
        titleItalicTail="ou venir nous voir."
        description="Le plus simple reste le téléphone — on décroche presque toujours, et on aime bien parler. L'email arrive aussi vite, mais en plus calme."
        image="https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=2400&q=85"
      />

      <section className="section">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            {/* Coordinates */}
            <RevealGroup className="space-y-12">
              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Adresse</p>
                <address className="font-serif text-3xl not-italic leading-tight text-bone-100">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </address>
                <p className="mt-3 text-[14.5px] text-bone-400">
                  Tram ligne A — arrêt Cathédrale (3 min à pied).
                  <br />
                  Parking Indigo Cathédrale, à 2 min.
                </p>
              </Reveal>

              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Téléphone</p>
                <a
                  href={`tel:${site.contact.phone}`}
                  className="font-serif text-3xl text-bone-100 hover:text-ember-500 transition-colors duration-600"
                >
                  {site.contact.phoneDisplay}
                </a>
                <p className="mt-3 text-[14.5px] text-bone-400">
                  Du mardi au dimanche, aux heures d'ouverture.
                </p>
              </Reveal>

              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Email</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-serif text-2xl text-bone-100 hover:text-ember-500 transition-colors duration-600 md:text-3xl"
                >
                  {site.contact.email}
                </a>
                <p className="mt-3 text-[14.5px] text-bone-400">
                  Réponse sous 24 heures, hors lundi.
                </p>
              </Reveal>

              <Reveal className="flex flex-wrap items-center gap-4">
                <Button href="/reservation" variant="primary" dot>
                  Réserver en ligne
                </Button>
                <Button href="https://maps.google.com" variant="outline">
                  Voir sur la carte
                </Button>
              </Reveal>
            </RevealGroup>

            {/* Hours */}
            <Reveal delay={0.2}>
              <div className="surface rounded-sm p-10">
                <p className="eyebrow mb-6 text-bone-500">Horaires d'ouverture</p>
                <ul className="divide-y divide-[var(--line)]">
                  {site.hours.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-baseline justify-between gap-4 py-4"
                    >
                      <span className="font-serif text-xl text-bone-100">{h.day}</span>
                      <span className="text-[14.5px] text-bone-400">{h.ranges.join(', ')}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-[var(--line)] pt-6 text-[14px] leading-relaxed text-bone-400">
                  <p>
                    La maison ferme exceptionnellement le 1er janvier, le
                    1er mai et entre Noël et le Jour de l'An. Les autres jours
                    fériés, les horaires sont ceux du dimanche.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map placeholder — discreet typographic block instead of an embed */}
      <section className="relative">
        <Divider label="Plan d'accès" className="container mb-16" />
        <div className="container">
          <div className="relative aspect-[16/7] overflow-hidden rounded-sm border border-[var(--line)] bg-ink-800">
            {/* SVG topographic placeholder — better than an iframe heavy on perfs */}
            <svg
              viewBox="0 0 1600 700"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(239,231,217,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="1600" height="700" fill="url(#grid)" />
              {/* Soft river curve evoking the Loire */}
              <path
                d="M 0 460 C 300 380, 600 540, 900 440 S 1400 360, 1600 420"
                stroke="rgba(198,151,105,0.35)"
                strokeWidth="3"
                fill="none"
              />
              <text
                x="900"
                y="320"
                textAnchor="middle"
                fontFamily="Fraunces, serif"
                fontSize="22"
                fill="rgba(239,231,217,0.6)"
              >
                Söma · 12 rue des Carmes
              </text>
              <circle cx="900" cy="350" r="6" fill="#dcb084" />
              <circle cx="900" cy="350" r="14" fill="rgba(220,176,132,0.3)" />
            </svg>
          </div>
        </div>
      </section>
    </>
  )
}
