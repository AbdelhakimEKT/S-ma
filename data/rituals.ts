import type { Ritual } from '@/lib/types'

/**
 * Catalogue des rituels. Les prix sont calibrés pour rester dans la
 * fourchette haute, crédible, d'un spa français de centre-ville en 2026.
 * Rien d'aspirationnel — on doit pouvoir réserver sans rire jaune.
 */
export const rituals: Ritual[] = [
  {
    slug: 'hammam-traditionnel',
    name: 'Hammam traditionnel',
    category: 'hammam',
    tagline: 'Le rituel fondateur, 90 minutes sous la vapeur.',
    description:
      "Un passage complet par les trois salles — tiède, chaude, repos — ponctué d'un gommage au savon noir et d'un rinçage à l'eau de fleur d'oranger.",
    longDescription:
      "Conçu comme un apprentissage du lâcher-prise. On commence par la salle tiède pour laisser le corps s'ouvrir, puis la salle chaude où la vapeur enveloppe complètement, avant un gommage minutieux au gant de kessa. La fin se déroule dans la salle de repos, sur des banquettes basses, un thé à la menthe à la main.",
    duration: 90,
    price: 68,
    maxGuests: 4,
    steps: [
      { title: 'Accueil & thé', body: 'Dix minutes au calme, thé à la menthe, vestiaire individuel, robe et mules.' },
      { title: 'Salle tiède', body: "Quinze minutes pour laisser la chaleur s'installer, respiration lente." },
      { title: 'Salle chaude', body: 'Vapeur à 45°C, infusion de vapeur au laurier et à l\'eucalyptus.' },
      { title: 'Gommage au savon noir', body: 'Au gant de kessa, mouvement long, rinçage à l\'eau tiède.' },
      { title: 'Repos', body: "Salle sombre, tapis épais, silence retenu, infusion et fruits secs." },
    ],
    included: ['Peignoir, mules, serviette', 'Savon noir, gant de kessa', 'Thé à la menthe, infusions, fruits secs', 'Accès bassin froid'],
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80',
    detailImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'rituel-du-lent',
    name: 'Rituel du lent',
    category: 'signature',
    tagline: 'Notre signature. Deux heures trente pour ralentir vraiment.',
    description:
      "Hammam, gommage au savon noir, enveloppement au rhassoul, massage à l'huile chaude. Notre manière à nous de poser un point final sur une semaine qui va trop vite.",
    longDescription:
      "Le Rituel du lent est né d'une obsession : donner assez de temps pour que le corps sorte de son mode urbain. On enchaîne lentement les étapes, sans chrono apparent, en laissant chaque transition se faire. C'est notre manière de dire : vous n'avez rien à faire ici, sinon vous déposer.",
    duration: 150,
    price: 189,
    maxGuests: 2,
    steps: [
      { title: 'Accueil long', body: 'Vingt minutes pour ralentir, infusion, vestiaire, présentation des étapes.' },
      { title: 'Hammam', body: "Vapeur, laurier, repos. Un passage complet, sans précipitation." },
      { title: 'Gommage savon noir', body: "Au gant de kessa, lent, insistant, rinçage tiède." },
      { title: 'Rhassoul', body: "Argile du Haut-Atlas, enveloppement complet, repos sous couverture chaude." },
      { title: 'Massage à l\'huile chaude', body: "Soixante minutes, huile d'argan tiédie, mouvements longs, pression ajustée." },
      { title: 'Repos final', body: "Salle sombre, thé, le temps que la tête revienne." },
    ],
    included: ['Peignoir premium, mules, serviette', 'Savon noir, rhassoul, huile d\'argan', 'Infusions maison, dattes, amandes'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80',
    detailImage: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'duo-lune',
    name: 'Duo Lune',
    category: 'duo',
    tagline: 'Un rituel à deux, dans une salle réservée.',
    description:
      "Hammam privatisé, gommage au savon noir et massage dos-nuque-jambes. Pour soi et quelqu'un qu'on aime — ami, amoureux, parent.",
    longDescription:
      "La salle Lune est notre plus petit espace privatisable : un hammam pour deux, une salle de repos intime, une banquette double. On y vient pour offrir du temps, pas pour être vu. Les échanges se font à voix basse, par habitude prise.",
    duration: 120,
    price: 298,
    perGroup: true,
    maxGuests: 2,
    steps: [
      { title: 'Accueil en duo', body: "Présentation à voix basse, vestiaire commun, infusion partagée." },
      { title: 'Hammam privatisé', body: "Vous êtes seuls dans la salle Lune. Vapeur, repos, chuchotements." },
      { title: 'Gommage', body: "Chacun est pris en charge par une praticienne, côte à côte." },
      { title: 'Massage dos-nuque-jambes', body: "Quarante-cinq minutes, côte à côte, lumière très basse." },
      { title: 'Repos ensemble', body: "Un plateau, deux infusions, un moment qui n'appartient qu'à vous." },
    ],
    included: ['Salle Lune privatisée', 'Deux peignoirs, mules, serviettes', 'Savon noir, huile d\'argan', 'Plateau d\'infusions & friandises'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80',
    detailImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'massage-argan',
    name: 'Massage à l\'huile d\'argan',
    category: 'soin',
    tagline: 'Soixante minutes, huile tiédie, mouvements longs.',
    description:
      "Un massage doux et enveloppant, à la pression modérée, pensé pour relâcher les épaules et le dos sans brusquer.",
    longDescription:
      "Ce n'est ni un massage sportif ni un massage ayurvédique. C'est notre approche — longue, continue, chaude. L'huile d'argan est tiédie au bain-marie. Les mouvements suivent le sens du souffle. On ressort ralenti, un peu flottant.",
    duration: 60,
    price: 92,
    maxGuests: 1,
    steps: [
      { title: 'Accueil', body: "Dix minutes pour se poser, thé, vestiaire, discussion brève sur les zones à privilégier." },
      { title: 'Massage', body: "Soixante minutes en continu, huile d'argan tiédie, lumière basse." },
      { title: 'Repos', body: "Le temps qu'il faut pour revenir." },
    ],
    included: ['Huile d\'argan tiédie', 'Peignoir, serviette', 'Thé & infusion'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'rituel-rhassoul',
    name: 'Rituel rhassoul',
    category: 'soin',
    tagline: "L'argile du Haut-Atlas, pour le corps et les cheveux.",
    description:
      "Enveloppement complet au rhassoul, suivi d'un rinçage tiède et d'un court massage du cuir chevelu. Une peau changée, littéralement.",
    duration: 75,
    price: 110,
    maxGuests: 1,
    steps: [
      { title: 'Accueil', body: 'Thé, vestiaire, courte discussion.' },
      { title: 'Application du rhassoul', body: 'Sur le corps et dans les cheveux, en mouvements lents.' },
      { title: 'Repos sous plaid chaud', body: 'Vingt minutes en silence, lumière très basse.' },
      { title: 'Rinçage & massage du cuir chevelu', body: 'Eau tiède, puis massage court du crâne et de la nuque.' },
    ],
    included: ['Rhassoul du Haut-Atlas', 'Peignoir, mules, serviette', 'Infusion finale'],
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'privatisation-maison',
    name: 'Privatisation de la maison',
    category: 'privatisation',
    tagline: "La maison rien que pour vous, pour un soir ou une demi-journée.",
    description:
      "Jusqu'à dix invités. Hammam, bains, salle de repos, plateau de saison. Pensée pour un anniversaire, une veille de mariage, ou une soirée entre amies qui refusent l'idée d'un restaurant.",
    longDescription:
      "La privatisation, c'est notre proposition la plus engagée. On ferme la maison au public, on adapte la musique, on ajuste la vapeur, on prépare un plateau de saison cuisiné par une amie traiteuse. Vous êtes chez vous, simplement.",
    duration: 180,
    price: 1490,
    perGroup: true,
    maxGuests: 10,
    steps: [
      { title: 'Accueil privé', body: 'Une maîtresse des lieux dédiée, présentation, vestiaire entier réservé.' },
      { title: 'Hammam & bains libres', body: 'Tout l\'espace est à vous. Rythme libre.' },
      { title: 'Plateau de saison', body: 'Servi dans la salle de repos, ajusté à votre groupe.' },
      { title: 'Repos', body: 'Tapis, coussins, musique basse, jusqu\'à la fermeture.' },
    ],
    included: ['Privatisation complète', 'Plateau traiteur de saison', 'Peignoirs, mules, serviettes', 'Une maîtresse des lieux dédiée'],
    image: 'https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&w=1600&q=80',
    detailImage: 'https://images.unsplash.com/photo-1554672408-730436b60dde?auto=format&fit=crop&w=1600&q=80',
  },
]

export function getRitualBySlug(slug: string): Ritual | undefined {
  return rituals.find((r) => r.slug === slug)
}
