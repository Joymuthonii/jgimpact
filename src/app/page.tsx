import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import FacilityGallery from '@/components/FacilityGallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Services />
      <FacilityGallery />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
