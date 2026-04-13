'use client'

import { motion } from 'framer-motion'

/**
 * Carte OpenStreetMap — aucune clé API requise.
 * Mobile-first : ratio 4/3 sur mobile, 16/7 sur desktop.
 * Les overlays sont empilés proprement à chaque breakpoint.
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
    /* overflow-hidden ici ET sur le parent pour bloquer tout débordement iframe */
    <div className="relative w-full overflow-hidden rounded-sm border border-[var(--line)]
                    aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7]">

      {/* Iframe — occupe tout le conteneur, filtre warm-sepia */}
      <iframe
        src={mapUrl}
        title="Plan d'accès — Söma, 12 rue des Carmes, Orléans"
        className="absolute inset-0 h-full w-full"
        style={{
          filter: 'brightness(0.82) saturate(0.55) sepia(28%)',
          border: 0,
          /* Empêche l'iframe de déborder hors du conteneur sur iOS */
          maxWidth: '100%',
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
        scrolling="no"
      />

      {/* Vignette intérieure */}
      <div className="pointer-events-none absolute inset-0 vignette" />

      {/* ── Card adresse ─── toujours visible, taille adaptée ─── */}
      <motion.a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0, 0.1, 1] }}
        whileHover={{ y: -2 }}
        className="group absolute bottom-4 left-4 surface rounded-sm p-4 md:bottom-6 md:left-6 md:p-5"
      >
        {/* Ember dot + label */}
        <span className="mb-2 flex items-center gap-2 md:mb-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
          </span>
          <span className="eyebrow text-[10px] text-bone-400 md:text-[11px]">Söma — Orléans</span>
        </span>

        <p className="font-serif text-[14px] leading-snug text-bone-100 md:text-[16px]">
          12 rue des Carmes
          <br />
          45000 Orléans
        </p>

        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-bone-400
                      group-hover:text-ember-400 transition-colors duration-300 md:mt-3">
          Ouvrir dans Maps
          <svg
            className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300"
            viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"
          >
            <path d="M2 6h8M7 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </motion.a>

      {/* ── Badge Tram — masqué sur mobile (trop petit), visible md+ ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="pointer-events-none absolute top-4 right-4 hidden surface rounded-sm
                   px-3 py-2.5 text-right md:block md:top-5 md:right-5 md:px-4 md:py-3"
      >
        <p className="text-[11px] text-bone-400">Tram A · arrêt Cathédrale</p>
        <p className="font-serif text-[12px] text-bone-200">3 min à pied</p>
      </motion.div>
    </div>
  )
}
