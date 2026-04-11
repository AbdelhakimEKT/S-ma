import type { Metadata } from 'next'
import Image from 'next/image'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'

export const metadata: Metadata = {
  title: 'Maison & équipe',
  description: "L'histoire de la maison Söma à Orléans, son équipe, ses choix.",
}

const team = [
  {
    name: 'Inès B.',
    role: 'Maîtresse des lieux, fondatrice',
    text: "A passé dix ans à Marrakech avant de revenir s'installer à Orléans, sa ville d'enfance. Cuisine très bien le tajine.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Karim L.',
    role: 'Praticien, co-fondateur',
    text: "Formé à la médecine traditionnelle marocaine, il dirige les rituels signatures et forme l'équipe au gommage au gant de kessa.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Léa M.',
    role: 'Praticienne',
    text: "Massothérapeute, formée en techniques douces (suédois, californien). C'est elle qui s'occupe du rituel à l'argan.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=85',
  },
  {
    name: 'Yann D.',
    role: 'Praticien',
    text: "Ancien kiné devenu praticien spa. Travaille beaucoup les pressions ajustées, les épaules, le dos.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
  },
]

const principles = [
  {
    title: 'On ne vend rien dans les salles',
    body: "Aucune crème, aucun complément, aucune carte de fidélité. Si vous aimez un produit, demandez à l'accueil — on a quelques pots pour la maison, sans plus.",
  },
  {
    title: 'On ne photographie pas',
    body: "Vous déposez votre téléphone à l'entrée, et nous aussi. La maison ne fait pas de photos de nos clientes et clients. Jamais.",
  },
  {
    title: "On parle à voix basse",
    body: "Pas par préciosité — par habitude prise. Une voix qui chuchote ralentit l'autre. C'est notre forme d'hospitalité.",
  },
  {
    title: 'On choisit nos matières',
    body: "Rhassoul du Haut-Atlas en direct d'une coopérative, savon noir d'Essaouira, huile d'argan extra-vierge. C'est plus cher, c'est volontaire.",
  },
]

export default function AProposPage() {
  return (
    <>
      <PageHeader
        kicker="La maison · Notre histoire"
        title="Söma,"
        titleItalicTail="six ans plus tard."
        description="Söma a ouvert en septembre 2019. À l'époque, c'était deux personnes, deux salles, et beaucoup de doutes. Aujourd'hui, c'est six praticien·nes, trois cents mètres carrés au cœur d'Orléans, et la même obsession qu'au début : ralentir."
        image="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=2400&q=85"
      />

      {/* Origin story */}
      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <Reveal>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <p className="eyebrow mb-6 text-bone-500">Une histoire courte</p>
              <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
                On voulait juste un endroit où l'on pourrait se taire.
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="space-y-7 text-[16.5px] leading-[1.85] text-bone-300">
            <Reveal>
              <p>
                Söma est née d'une frustration. Inès avait passé dix ans à
                vivre entre Marrakech et Paris, à fréquenter aussi bien les
                hammams traditionnels d'origine que les spas hôteliers
                aseptisés des palaces. Elle ne retrouvait nulle part ce
                qu'elle cherchait : un lieu sans musique, sans précipitation,
                où l'on n'essaye pas de vous vendre quoi que ce soit.
              </p>
            </Reveal>
            <Reveal>
              <p>
                Karim, lui, sortait de quinze ans de pratique en spa hôtelier.
                Il en avait assez des protocoles minutés, des consignes de
                rendement, et de cette manière qu'on a partout de chuchoter
                fort. Ils se sont rencontrés à l'occasion d'une conférence sur
                les médecines traditionnelles, en 2017. Deux ans plus tard,
                ils signaient le bail de la rue des Carmes.
              </p>
            </Reveal>
            <Reveal>
              <p>
                La maison a ouvert juste avant le premier confinement.
                Autant dire que les six premiers mois ont été instructifs.
                Mais c'est probablement ce qui a forgé Söma : on a appris très
                vite à ne pas courir après le volume, à recevoir peu de monde,
                à mieux le recevoir.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-bone-200">
                Aujourd'hui, on tourne à environ trente visites par jour. C'est
                volontaire. Ça nous va.
              </p>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      <Divider label="Nos principes" className="container" />

      {/* Principles */}
      <section className="section pt-20">
        <div className="container">
          <RevealGroup className="grid gap-x-12 gap-y-12 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="group relative border-l border-[var(--line)] pl-8">
                  <span className="absolute left-0 top-3 -ml-[3px] h-1.5 w-1.5 rounded-full bg-ember-500" />
                  <h3 className="font-serif text-2xl leading-tight text-bone-100">{p.title}</h3>
                  <p className="mt-4 max-w-[50ch] text-[15.5px] leading-relaxed text-bone-400">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Divider label="L'équipe" className="container" />

      {/* Team */}
      <section className="section pt-20">
        <div className="container">
          <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm grayscale-[60%] transition-all duration-900 ease-soma group-hover:grayscale-0">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-bone-100">{m.name}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-wide-1 text-bone-500">{m.role}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-bone-400">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  )
}
