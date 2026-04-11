# Söma — Maison de rituels

Site vitrine et module de réservation pour **Söma**, maison de rituels fictive basée à Orléans : hammam, bains, soins et rituels en duo.

Projet portfolio — pensé comme une vraie base exploitable en production, pas une démo. Stack moderne, motion design maîtrisé, accessibilité et performance soignées.

## Stack

- **Next.js 14** — App Router, React Server Components, routing par segments
- **TypeScript** — strict, paths `@/*`
- **Tailwind CSS** — design tokens custom (palette warm-stone, typographies, easings)
- **Framer Motion** — orchestration des entrées en scène, hover, transitions
- **Lenis** — smooth scroll natif, respectueux de `prefers-reduced-motion`
- **next/font** — Fraunces (serif display) + Inter (sans), self-hosted

## Structure

```
app/
  layout.tsx            # root layout, fonts, smooth scroll, header/footer
  globals.css           # tokens, base, utilitaires motion
  page.tsx              # Home
  lieu/                 # Le lieu
  rituels/              # Liste + détail d'un rituel
  tarifs/               # Formules & tarifs
  reservation/          # Flow de réservation multi-étapes
  a-propos/             # Notre maison
  contact/              # Contact + infos pratiques
  faq/                  # FAQ
  cadeaux/              # Bons cadeaux
  journal/              # Journal, écrits autour du rituel
components/
  layout/               # Header, Footer, SmoothScroll, PageFrame
  ui/                   # Reveal, Button, Marquee, Magnetic, SplitText, Divider
  home/                 # Sections spécifiques à la home
  reservation/          # Étapes du flow de réservation
data/
  site.ts               # Infos de marque (adresse, horaires, contact)
  rituals.ts            # Catalogue de rituels
  experiences.ts        # Formules, duo, privatisation
  testimonials.ts       # Voix clientes
  journal.ts            # Articles du journal
  faq.ts                # Questions fréquentes
lib/
  types.ts              # Types partagés (Rituel, Réservation, Slot, etc.)
  utils.ts              # cn(), formatters (prix, durée, date)
  motion.ts             # Variants Framer Motion réutilisables
  reservation.ts        # Logique mockée : disponibilités, validation, soumission
public/                 # (optionnel) assets locaux
```

## Philosophie du projet

Le site est pensé comme une **expérience sensorielle maîtrisée**, pas comme une vitrine générique. Les choix suivent trois principes :

1. **Lenteur choisie.** Les animations sont lentes (400–900 ms), montées sur des easings `cubic-bezier(0.22, 1, 0.36, 1)`. Rien ne claque, tout respire.
2. **Matière.** Grain SVG embarqué, palette warm-stone (ink, bone, ember), typographies contrastées (serif calme + sans neutre).
3. **Fonctionnel d'abord.** Le module de réservation est un vrai produit — types TypeScript, étapes, validation, récap, succès. Il est branchable à un backend (API routes, Stripe, emails) sans réécriture.

## Réservation — architecture

Pensée comme une **feature produit**, pas comme un formulaire cosmétique.

- **Catalogue** : `data/rituals.ts` + `data/experiences.ts`
- **Types** : `lib/types.ts` — `Ritual`, `Slot`, `Guest`, `ReservationDraft`, `ReservationResult`
- **Logique** : `lib/reservation.ts` — `generateSlotsForDate()`, `computeTotal()`, `submitReservation()`
- **Flow UI** : `components/reservation/` — 6 étapes (service → date → créneau → personnes → infos → récap → succès)
- **Disponibilités** : mockées mais déterministes (seed par date + durée), cohérentes pour une vraie UX

Brancher un backend : remplacer `submitReservation()` par un appel à une API route Next (`app/api/reservations/route.ts`), connecter une DB (Postgres + Prisma), ajouter Stripe PaymentIntents pour l'acompte, et un service d'email transactionnel (Resend / Postmark) pour les confirmations.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Notes

- Projet fictif à vocation portfolio. Toute ressemblance avec un établissement existant est fortuite.
- Les images viennent d'Unsplash (remote patterns configurés dans `next.config.mjs`).
- Les tarifs sont calibrés pour rester crédibles (équivalents d'un spa haut de gamme français en 2026), pas aspirationnels.
