import type { Metadata } from 'next'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import MapEmbed from '@/components/contact/MapEmbed'
import SocialLinks from '@/components/contact/SocialLinks'
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

      {/* ── Coordonnées + Horaires ────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">

            {/* Coordonnées */}
            <RevealGroup className="space-y-12">
              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Adresse</p>
                <address className="font-serif text-3xl not-italic leading-tight text-bone-100">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </address>
                <ul className="mt-4 space-y-1.5 text-[14px] text-bone-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                    Tram ligne A · arrêt Cathédrale, 3 min à pied
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500/50" />
                    Parking Indigo Cathédrale, à 2 min
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500/50" />
                    Vélos — appuis devant la porte
                  </li>
                </ul>
              </Reveal>

              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Téléphone</p>
                <a
                  href={`tel:${site.contact.phone}`}
                  className="font-serif text-3xl text-bone-100 hover:text-ember-400 transition-colors duration-500"
                >
                  {site.contact.phoneDisplay}
                </a>
                <p className="mt-2 text-[14px] text-bone-400">
                  Du mardi au dimanche, aux heures d'ouverture.
                </p>
              </Reveal>

              <Reveal>
                <p className="eyebrow mb-4 text-bone-500">Email</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-serif text-2xl text-bone-100 hover:text-ember-400 transition-colors duration-500 md:text-3xl"
                >
                  {site.contact.email}
                </a>
                <p className="mt-2 text-[14px] text-bone-400">
                  Réponse sous 24 heures, hors lundi.
                </p>
              </Reveal>

              <Reveal className="flex flex-wrap items-center gap-4">
                <Button href="/reservation" variant="primary" dot>
                  Réserver en ligne
                </Button>
                <Button
                  href="https://www.openstreetmap.org/?mlat=47.9027&mlon=1.9083&zoom=17"
                  variant="outline"
                >
                  Ouvrir dans Maps
                </Button>
              </Reveal>
            </RevealGroup>

            {/* Horaires */}
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
                      <span className="text-[14px] text-bone-400">{h.ranges.join(', ')}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-[var(--line)] pt-6 text-[13.5px] leading-relaxed text-bone-400">
                  La maison ferme exceptionnellement le 1er janvier,
                  le 1er mai et entre Noël et le Jour de l'An.
                  Les autres jours fériés, les horaires sont ceux du dimanche.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Carte ────────────────────────────────────────────────────────────── */}
      <section className="pb-0">
        <Divider label="Plan d'accès" className="container mb-16" />
        <div className="container">
          <Reveal>
            <MapEmbed />
          </Reveal>
        </div>
      </section>

      {/* ── Suivez la maison ─────────────────────────────────────────────────── */}
      <section className="section bg-ink-800">
        <div className="container max-w-3xl">
          <Reveal className="mb-12">
            <p className="eyebrow mb-4 text-bone-500">Suivez la maison</p>
            <h2 className="font-serif text-display-md leading-[1] text-bone-100">
              Deux fenêtres
              <br />
              <em className="text-bone-300">sur le quotidien.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <SocialLinks />
          </Reveal>

          {/* Note éditoriale */}
          <Reveal delay={0.3} className="mt-10 border-t border-[var(--line)] pt-8">
            <p className="max-w-[52ch] text-[14px] leading-relaxed text-bone-500">
              Pas de publications à heures fixes, pas de stratégie de contenu.
              Juste des images quand elles méritent d'exister — une vapeur
              qui monte, une lumière juste avant l'ouverture.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
