import type { Metadata } from 'next'
import Image from 'next/image'
import PageHeader from '@/components/layout/PageHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Le lieu',
  description:
    "Une maison discrète au cœur d'Orléans, à deux pas de la cathédrale. Hammam, bains, salles de repos.",
}

const rooms = [
  {
    name: 'Salle tiède',
    detail: '38°C',
    text: "Sols de pierre claire, banquettes basses. C'est ici que tout commence : on s'assoit, on respire, on laisse la chaleur s'installer.",
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
  },
  {
    name: 'Salle chaude',
    detail: '45°C',
    text: "Vapeur dense, parfumée au laurier. Lumière basse, voix retenue. Quinze à vingt minutes suffisent.",
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1400&q=85',
  },
  {
    name: 'Bassin froid',
    detail: '12°C',
    text: "Une cuve de pierre qu'on rejoint après le hammam, en deux respirations. Court et net.",
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=85',
  },
  {
    name: 'Salle de repos',
    detail: 'Lumière de bougie',
    text: "Tapis épais, coussins bas, plaids tièdes. C'est l'endroit où l'on revient à soi avant de repartir.",
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85',
  },
]

export default function LieuPage() {
  return (
    <>
      <PageHeader
        kicker="Le lieu · Orléans"
        title="Une maison"
        titleItalicTail="à voix basse."
        description="Söma occupe trois cents mètres carrés au cœur du centre historique d'Orléans, à deux pas de la cathédrale Sainte-Croix. L'espace a été repensé en 2019 par une architecte d'intérieur tourangelle, autour de quatre matériaux : pierre, bois, cuivre, lin."
        image="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=2400&q=85"
      />

      {/* Big editorial intro */}
      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <p className="eyebrow mb-6 text-bone-500">Une visite</p>
              <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
                On entre, on dépose son téléphone, on respire.
              </h2>
            </div>
          </Reveal>
          <RevealGroup className="space-y-7 text-[16.5px] leading-[1.8] text-bone-300">
            <Reveal>
              <p>
                La porte est en chêne brut, peinte en vert sourd. Vous poussez,
                vous entrez dans une petite pièce où une plante en pot, une
                banquette basse et une voix qui vous accueille. On vous donne
                un peignoir, une paire de mules, une serviette pesante. Vous
                déposez votre téléphone dans une boîte en bois — la maison ne
                fait pas de photos, et nous préférons que vous non plus.
              </p>
            </Reveal>
            <Reveal>
              <p>
                Vous traversez ensuite un long couloir éclairé par des
                appliques de cuivre. À gauche, le vestiaire individuel ; à
                droite, la première salle, dite tiède. La lumière baisse de
                section en section, comme si l'on s'enfonçait progressivement
                dans la maison.
              </p>
            </Reveal>
            <Reveal>
              <p>
                À l'autre bout, après les soins, une grande salle de repos
                ouvre sur un patio intérieur. On y boit une infusion, on y
                mange des dattes, on y dort un peu si l'on veut. Personne ne
                vous met dehors. Vous repartez quand vous êtes prêt, pas avant.
              </p>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      <Divider label="Les espaces" className="container" />

      {/* Rooms grid */}
      <section className="section pt-20">
        <div className="container">
          <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 md:gap-y-24">
            {rooms.map((r, i) => (
              <Reveal
                key={r.name}
                delay={i * 0.08}
                className={i % 2 === 1 ? 'md:mt-24' : ''}
              >
                <div className="group">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                    <Image
                      src={r.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-900 ease-soma group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-2xl text-bone-100 md:text-3xl">{r.name}</h3>
                      <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-bone-400">
                        {r.text}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="eyebrow text-bone-500">Repère</div>
                      <div className="mt-1 font-serif text-lg text-bone-200">{r.detail}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Practical strip */}
      <section className="section">
        <div className="container">
          <div className="surface rounded-sm p-10 md:p-14">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <p className="eyebrow mb-4 text-bone-500">Venir nous voir</p>
                <h3 className="font-serif text-display-md text-bone-100">
                  12 rue des Carmes, 45000 Orléans.
                </h3>
                <p className="mt-6 max-w-[55ch] text-[15.5px] leading-relaxed text-bone-400">
                  Tram ligne A, arrêt Cathédrale (3 min à pied). Parking
                  Indigo Cathédrale à deux pas. Si vous arrivez en voiture
                  depuis Paris, comptez environ une heure dix par l'A10, sortie
                  Orléans-Centre.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Button href="/contact" variant="outline">Itinéraire & contact</Button>
                <Button href="/reservation" variant="primary" dot>Réserver</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
