/**
 * Domain types for Söma.
 * Kept intentionally narrow — these are the shapes that cross the
 * boundary between data, UI, and the (future) backend.
 */

export type RitualCategory = 'hammam' | 'soin' | 'duo' | 'signature' | 'privatisation'

export interface Ritual {
  slug: string
  name: string
  category: RitualCategory
  tagline: string
  description: string
  /** Longer narrative — shown on the detail page. */
  longDescription?: string
  /** Minutes. */
  duration: number
  /** EUR, TTC, per guest unless `perGroup` is true. */
  price: number
  perGroup?: boolean
  /** Maximum guests for this ritual. */
  maxGuests: number
  /** Key steps composing the ritual. */
  steps: Array<{ title: string; body: string }>
  /** Included items (robe, thé, etc.). */
  included: string[]
  image: string
  /** Accent image used in decoration. */
  detailImage?: string
}

export interface Experience {
  slug: string
  name: string
  kicker: string
  description: string
  /** Bullet-point highlights. */
  highlights: string[]
  /** Price from (EUR). */
  priceFrom: number
  /** Total duration in minutes. */
  duration: number
  image: string
}

export interface Testimonial {
  name: string
  city: string
  quote: string
  ritual: string
}

export interface JournalEntry {
  slug: string
  title: string
  kicker: string
  excerpt: string
  /** Full body in markdown-ish plain text — kept simple on purpose. */
  body: string[]
  readingTime: number
  date: string
  author: string
  image: string
}

export interface FAQItem {
  question: string
  answer: string
  category: 'rituels' | 'pratique' | 'cadeaux' | 'annulation'
}

/* ------------------------------ Reservation ------------------------------ */

export interface Slot {
  /** "HH:mm". */
  time: string
  /** Absolute date (local). */
  date: string
  /** Remaining capacity — 0 means full. */
  remaining: number
}

export interface Guest {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes?: string
  /** Opt-in for the maison's newsletter — never pre-checked. */
  newsletter: boolean
  /** RGPD consent is required. */
  consent: boolean
}

export interface ReservationDraft {
  ritualSlug: string | null
  date: string | null
  time: string | null
  guests: number
  guest: Guest
}

export interface ReservationResult {
  id: string
  ritualSlug: string
  ritualName: string
  date: string
  time: string
  guests: number
  total: number
  guest: Guest
  createdAt: string
}

export type ReservationStepId =
  | 'service'
  | 'date'
  | 'guests'
  | 'info'
  | 'recap'
  | 'success'
