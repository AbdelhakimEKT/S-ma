import Link from 'next/link'
import { site, nav } from '@/data/site'

/**
 * Footer — information-dense but calm, with a slow closing line.
 *
 * Server component: no state, no motion. Loaded once at the bottom of the
 * layout, below the fold for most routes.
 */
export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] bg-ink-900 text-bone-300">
      <div className="container pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Mark + mission */}
          <div className="max-w-sm">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl tracking-tight-1 text-bone-100">Söma</span>
              <span className="text-bone-500 text-sm">Maison de rituels</span>
            </div>
            <p className="mt-6 text-pretty text-[15px] leading-relaxed text-bone-400">
              Une maison discrète au cœur d'Orléans. Hammam traditionnel, bains,
              soins lents, pensés pour que l'on puisse vraiment s'y déposer.
            </p>
            <p className="mt-6 text-sm text-bone-500">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </p>
          </div>

          {/* Explore */}
          <FooterColumn title="Explorer">
            {nav.map((item) => (
              <li key={item.href}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          {/* Pratique */}
          <FooterColumn title="Pratique">
            <li>
              <FooterLink href="/faq">Questions fréquentes</FooterLink>
            </li>
            <li>
              <FooterLink href="/cadeaux">Bons cadeaux</FooterLink>
            </li>
            <li>
              <FooterLink href="/contact">Accès & horaires</FooterLink>
            </li>
            <li>
              <FooterLink href="/reservation">Réserver</FooterLink>
            </li>
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Nous écrire">
            <li>
              <a
                className="group inline-flex items-center gap-2 text-bone-300 hover:text-bone-100 transition-colors duration-600"
                href={`mailto:${site.contact.email}`}
              >
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                className="group inline-flex items-center gap-2 text-bone-300 hover:text-bone-100 transition-colors duration-600"
                href={`tel:${site.contact.phone}`}
              >
                {site.contact.phoneDisplay}
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <FooterLink href={s.href}>{s.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>
        </div>

        {/* Hours ribbon */}
        <div className="mt-16 border-t border-[var(--line)] pt-10">
          <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-start">
            <div className="eyebrow">Horaires</div>
            <ul className="grid gap-x-10 gap-y-2 text-sm text-bone-400 sm:grid-cols-2 lg:grid-cols-3">
              {site.hours.map((h) => (
                <li key={h.day} className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-2">
                  <span className="text-bone-200">{h.day}</span>
                  <span>{h.ranges.join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-bone-500">
            © {new Date().getFullYear()} Söma — Maison de rituels. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-xs text-bone-500">
            <Link href="/faq" className="hover:text-bone-200">Mentions légales</Link>
            <Link href="/faq" className="hover:text-bone-200">Politique de confidentialité</Link>
            <span className="hidden md:inline">Site fictif, projet portfolio.</span>
          </div>
        </div>
      </div>

      {/* Faint serif signature block */}
      <div
        aria-hidden
        className="relative overflow-hidden border-t border-[var(--line)]"
      >
        <div className="container flex items-end justify-center py-8 md:py-12">
          <span className="font-serif text-[12vw] leading-[0.8] tracking-tight-2 text-bone-100/[0.05] select-none">
            Söma
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center text-bone-400 hover:text-bone-100 transition-colors duration-600"
    >
      <span>{children}</span>
    </Link>
  )
}
