import Hero from '@/components/home/Hero'
import Manifesto from '@/components/home/Manifesto'
import RitualsPreview from '@/components/home/RitualsPreview'
import Experience from '@/components/home/Experience'
import Testimonials from '@/components/home/Testimonials'
import JournalPreview from '@/components/home/JournalPreview'
import Cta from '@/components/home/Cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <RitualsPreview />
      <Experience />
      <Testimonials />
      <JournalPreview />
      <Cta />
    </>
  )
}
