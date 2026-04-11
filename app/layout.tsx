import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

import SmoothScroll from '@/components/layout/SmoothScroll'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Noise from '@/components/ui/Noise'
import { site } from '@/data/site'

/* -------------------------------- Fonts -------------------------------- */

const fontDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
})

const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

/* -------------------------------- Metadata ------------------------------ */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'hammam Orléans',
    'spa Orléans',
    'soins hammam',
    'rituel bien-être',
    'massage Orléans',
    'Söma',
    'maison de rituels',
  ],
  authors: [{ name: 'Söma' }],
  openGraph: {
    title: site.fullName,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.fullName,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c0a08',
  width: 'device-width',
  initialScale: 1,
}

/* --------------------------------- Layout ------------------------------- */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="relative min-h-dvh bg-ink-900 text-bone-200 antialiased">
        {/* Structured data — LocalBusiness / Spa */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HealthAndBeautyBusiness',
              name: site.fullName,
              description: site.description,
              image: `${site.url}/og.jpg`,
              url: site.url,
              telephone: site.contact.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: site.address.street,
                addressLocality: site.address.city,
                postalCode: site.address.postalCode,
                addressCountry: 'FR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: site.address.coordinates.lat,
                longitude: site.address.coordinates.lng,
              },
              openingHoursSpecification: site.hours
                .filter((h) => !h.ranges[0]?.toLowerCase().includes('repos'))
                .map((h) => ({
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: h.day,
                  opens: h.ranges[0]?.split('–')[0]?.trim(),
                  closes: h.ranges[0]?.split('–')[1]?.trim(),
                })),
            }),
          }}
        />

        <SmoothScroll>
          <Noise />
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
