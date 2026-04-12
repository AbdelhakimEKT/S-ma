/**
 * Brand-level data. Single source of truth for contact, opening hours,
 * social links and SEO metadata.
 */

export const site = {
  name: 'Söma',
  fullName: 'Söma — Maison de rituels',
  tagline: 'Bains, hammam & soins, Orléans.',
  description:
    'Söma est une maison de rituels à Orléans. Hammam traditionnel, bains chauds et soins lents, pensés comme une parenthèse hors du temps, à deux pas des bords de Loire.',
  url: 'https://soma-orleans.fr',
  address: {
    street: '12 rue des Carmes',
    city: 'Orléans',
    postalCode: '45000',
    country: 'France',
    /** Approximate — the building sits between the Cathédrale and la place du Martroi. */
    coordinates: { lat: 47.9027, lng: 1.9083 },
  },
  contact: {
    phone: '+33 2 38 00 00 00',
    phoneDisplay: '02 38 00 00 00',
    email: 'bonjour@soma-orleans.fr',
    bookingEmail: 'reservation@soma-orleans.fr',
  },
  hours: [
    { day: 'Mardi', ranges: ['11:00 – 21:00'] },
    { day: 'Mercredi', ranges: ['11:00 – 21:00'] },
    { day: 'Jeudi', ranges: ['11:00 – 22:00'] },
    { day: 'Vendredi', ranges: ['11:00 – 22:00'] },
    { day: 'Samedi', ranges: ['10:00 – 22:00'] },
    { day: 'Dimanche', ranges: ['10:00 – 20:00'] },
    { day: 'Lundi', ranges: ['Repos de la maison'] },
  ],
  socials: [
    {
      label: 'Instagram',
      handle: '@soma.orleans',
      href: 'https://instagram.com',
      description: 'Les coulisses, la lumière du matin, l\'ordinaire du beau.',
    },
    {
      label: 'TikTok',
      handle: '@soma.orleans',
      href: 'https://tiktok.com',
      description: 'Les rituels en mouvement, les soins filmés au plus près.',
    },
  ],
} as const

export const nav = [
  { label: 'Le lieu', href: '/lieu' },
  { label: 'Rituels', href: '/rituels' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'Cadeaux', href: '/cadeaux' },
  { label: 'Journal', href: '/journal' },
  { label: 'Maison', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
] as const
