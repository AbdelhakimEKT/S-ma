import type { JournalEntry } from '@/lib/types'

/**
 * Carnet de la maison — textes courts, écrits comme des entrées de carnet
 * plus que comme des articles de blog. Ton doux, première personne discrète.
 */
export const journal: JournalEntry[] = [
  {
    slug: 'ralentir-nest-pas-mou',
    title: "Ralentir n'est pas mou",
    kicker: 'Carnet',
    excerpt:
      "On confond souvent la lenteur avec l'inaction. Pour nous, ralentir est un geste précis — peut-être le plus précis que l'on ait.",
    body: [
      "Il y a une méprise qu'on entend revenir à l'accueil : ralentir, ce serait laisser aller, se vautrer, ne plus rien décider. On n'est pas d'accord. Ralentir, chez nous, c'est ajuster une chaleur au demi-degré près. C'est poser une serviette exactement là où il faut. C'est choisir la minute où l'on passe d'une salle à l'autre.",
      "La vraie lenteur exige beaucoup d'attention. Elle n'a rien de mou. Elle ressemble plus à un geste d'horloger qu'à un soupir.",
      "Quand une cliente nous dit : je ne sais pas me détendre, on lui répond souvent : c'est parce qu'on vous demande de le faire. Ici, on ne vous le demande pas. On installe les conditions, et c'est la maison qui fait le reste.",
    ],
    readingTime: 3,
    date: '2026-02-14',
    author: 'Inès, maîtresse des lieux',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'pourquoi-nous-ne-parlons-pas-fort',
    title: 'Pourquoi nous ne parlons pas fort',
    kicker: 'Maison',
    excerpt:
      "À l'ouverture, une cliente nous a dit : j'adore, mais vous chuchotez, c'est voulu ? Oui. Et voici pourquoi.",
    body: [
      "À Söma, l'équipe parle à voix basse. Ce n'est ni une consigne écrite, ni une obsession pour le calme stérile. C'est un choix d'hospitalité.",
      "On a remarqué qu'une voix qui murmure ralentit l'autre. Elle pose une invitation silencieuse : tu peux répondre moins fort. Et plus on parle doucement, plus la conversation se charge d'attention.",
      "Ce n'est pas un lieu silencieux. On rit, on se raconte des choses, on pose des questions. Mais sans jamais chercher à couvrir quelqu'un. Cette petite discipline change, discrètement, l'épaisseur d'une visite.",
    ],
    readingTime: 2,
    date: '2026-01-28',
    author: 'Inès, maîtresse des lieux',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'le-rhassoul-ou-la-patience',
    title: "Le rhassoul, ou la patience",
    kicker: 'Matières',
    excerpt:
      "On nous demande souvent d'où vient notre argile. Voici l'histoire courte — et les raisons pour lesquelles on n'en changera pas.",
    body: [
      "Notre rhassoul vient d'une coopérative de femmes du Haut-Atlas marocain. Il est extrait à la main, séché au soleil, broyé sans ajout. On l'achète directement, par sacs de vingt kilos, quatre fois par an.",
      "Ce n'est pas le plus simple. Il faut prévoir les commandes longtemps à l'avance, gérer la logistique, s'assurer que l'argile ne prend pas l'humidité. On aurait pu choisir un rhassoul industriel européen, conditionné en pots. On ne l'a pas fait.",
      "Parce que la matière n'est pas la même. Parce que les gestes, à la coopérative, ont une lenteur qui ressemble à la nôtre. Et parce qu'il faut bien que quelque part, l'argile raconte quelque chose de plus grand qu'un soin.",
    ],
    readingTime: 3,
    date: '2026-01-10',
    author: 'Karim, praticien',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'venir-seul',
    title: 'Venir seul, et ce que cela dit de nous',
    kicker: 'Carnet',
    excerpt:
      "Près d'un tiers de nos visites se font seules. C'est une statistique qui nous a surpris, et qui nous touche.",
    body: [
      "On pensait qu'on verrait surtout des duos. C'est en fait presque l'inverse. Beaucoup de nos clientes et clients viennent seuls, souvent en semaine, souvent après le travail. Elles posent leur téléphone à l'entrée, se déshabillent, et ne parlent plus à personne pendant deux heures.",
      "C'est une forme d'hospitalité qu'on n'avait pas vraiment anticipée : offrir un endroit où l'on peut être avec soi-même, sans que ce soit triste. Les bains et le hammam y aident — la chaleur a cette qualité d'être à la fois enveloppante et discrète.",
      "Alors, si vous hésitez à venir seul : venez. Vraiment. C'est probablement ici que l'idée de solitude est la plus douce.",
    ],
    readingTime: 2,
    date: '2025-12-18',
    author: 'Inès, maîtresse des lieux',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80',
  },
]

export function getJournalBySlug(slug: string): JournalEntry | undefined {
  return journal.find((j) => j.slug === slug)
}
