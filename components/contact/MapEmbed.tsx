'use client'

import { motion } from 'framer-motion'

/**
 * Carte OpenStreetMap — aucune clé API requise.
 * Filtre CSS warm-sepia pour coller à la DA ink/bone/ember.
 * La card flottante affiche l'adresse + lien Maps.
 */
export default function MapEmbed() {
  const mapUrl =
    'https://www.openstreetmap.org/export/embed.html' +
    '?bbox=1.8993%2C47.8997%2C1.9173%2C47.9057' +
    '&layer=mapnik' +
    '&marker=47.9027%2C1.9083'

  const mapsLink =
    'https://www.openstreetmap.org/?mlat=47.9027&mlon=1.9083&zoom=17'

  return (
    <div className="relative aspect-[16/7] overflow-hidden rounded-sm border border-[var(--line)]">
      {/* Map iframe — filtre warm-sepia pour cohérence DA */}
      <iframe
        src={mapUrl}
        title="Plan d'accès — Söma, 12 rue des Carmes, Orléans"
        className="absolute inset-0 h-full w-full"
        style={{
          filter: 'brightness(0.82) saturate(0.55) sepia(28%)',
          border: 0,
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Vignette intérieure pour fondre les bords */}
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* Card flottante — adresse + lien */}
      <motion.a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0, 0.1, 1] }}
        whileHover={{ y: -2 }}
        className="absolute bottom-6 left-6 surface rounded-sm p-5 max-w-[240px] group"
      >
        {/* Ember dot */}
        <span className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
          </span>
          <span className="eyebrow text-bone-400">Söma — Orléans</span>
        </span>

        <p className="font-serif text-[16px] leading-snug text-bone-100">
          12 rue des Carmes
          <br />
          45000 Orléans
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-bone-400 group-hover:text-ember-400 transition-colors duration-300">
          Ouvrir dans Maps
          <svg
            className="h-3 w-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </motion.a>

      {/* Accès rapide — coin supérieur droit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="pointer-events-none absolute top-5 right-5 surface rounded-sm px-4 py-3 text-right"
      >
        <p className="text-[12px] text-bone-400">Tram A · arrêt Cathédrale</p>
        <p className="font-serif text-[13px] text-bone-200">3 min à pied</p>
      </motion.div>
    </div>
  )
}
