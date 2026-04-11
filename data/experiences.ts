import type { Experience } from '@/lib/types'

/**
 * Formules mises en avant sur la home et la page Tarifs.
 * Elles renvoient vers des rituels existants — pas de doublon de données.
 */
export const experiences: Experience[] = [
  {
    slug: 'echappee-courte',
    name: "L'échappée courte",
    kicker: 'Une heure et demie',
    description:
      "Le format que l'on conseille pour une première visite — hammam, gommage, thé. Ni trop long pour un mardi soir, ni trop court pour en ressortir changé.",
    highlights: ['Hammam traditionnel', 'Gommage savon noir', 'Repos & infusion'],
    priceFrom: 68,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'parenthese-longue',
    name: 'La parenthèse longue',
    kicker: 'Deux heures trente',
    description:
      "Notre rituel signature. Hammam, gommage, enveloppement, massage à l'huile chaude. Pour les fois où il faut vraiment ralentir.",
    highlights: ['Rituel du lent', 'Enveloppement rhassoul', 'Massage 60 min'],
    priceFrom: 189,
    duration: 150,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'en-duo',
    name: 'En duo',
    kicker: 'Deux heures, à deux',
    description:
      "Salle Lune privatisée, hammam en tête-à-tête, massage côte à côte. Pour offrir du temps, plus que du soin.",
    highlights: ['Salle Lune privatisée', 'Hammam & gommage', 'Massage côte à côte'],
    priceFrom: 298,
    duration: 120,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80',
  },
]
