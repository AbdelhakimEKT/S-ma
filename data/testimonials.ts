import type { Testimonial } from '@/lib/types'

/**
 * Voix de clientes — écrites comme des petits mots laissés à la fin d'une visite.
 * Pas de superlatifs creux, pas de "5 étoiles". Juste ce qu'on a entendu.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Claire',
    city: 'Orléans',
    quote:
      "Je suis venue un mardi soir après une semaine impossible. Je suis ressortie en ayant l'impression d'avoir dormi trois nuits d'affilée. Je n'avais même pas fait grand-chose — juste laissé faire.",
    ritual: 'Hammam traditionnel',
  },
  {
    name: 'Inès & Sam',
    city: 'Paris',
    quote:
      "On voulait offrir autre chose qu'un dîner pour les dix ans de Sam. Le Duo Lune, c'était la bonne idée. On n'a pas parlé pendant deux heures, et c'est tout à fait ce qu'on avait besoin de faire.",
    ritual: 'Duo Lune',
  },
  {
    name: 'Marina',
    city: 'Tours',
    quote:
      "Ce que j'aime ici, c'est que personne ne parle fort. Personne ne vous vend quoi que ce soit. On vous tend une infusion, on vous dit prenez votre temps, et c'est vrai.",
    ritual: 'Rituel du lent',
  },
  {
    name: 'Héloïse',
    city: 'Blois',
    quote:
      "J'ai privatisé la maison pour l'anniversaire de ma mère. C'était la bonne échelle — assez grand pour qu'on soit ensemble, assez petit pour qu'on se raconte des choses.",
    ritual: 'Privatisation',
  },
  {
    name: 'Bastien',
    city: 'Orléans',
    quote:
      "Je pensais détester. J'avais tort. Une heure de massage à l'argan, et j'ai compris pourquoi ma sœur n'arrêtait pas d'insister.",
    ritual: "Massage à l'huile d'argan",
  },
  {
    name: 'Yasmine',
    city: 'Orléans',
    quote:
      "Je venais en sortant d'un rendez-vous médical pas facile. Personne ne m'a demandé pourquoi je pleurais un peu. On m'a juste ajouté une couverture. Je reviendrai.",
    ritual: 'Rituel rhassoul',
  },
]
