import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center">
      <div className="container max-w-xl text-center">
        <p className="eyebrow text-bone-500">Erreur 404</p>
        <h1 className="mt-6 font-serif text-display-md leading-[1.02] text-bone-100">
          Cette page n'existe pas — <span className="italic text-bone-300">ou pas encore.</span>
        </h1>
        <p className="mt-6 text-[15.5px] leading-relaxed text-bone-400">
          Vous avez peut-être suivi un lien obsolète, ou inventé une adresse pour
          voir. Dans les deux cas, on vous ramène à l'entrée de la maison.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="primary" dot>Retour à l'accueil</Button>
          <Button href="/reservation" variant="outline">Réserver un rituel</Button>
        </div>
      </div>
    </section>
  )
}
