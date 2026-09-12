'use client'

import { Phone } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import BookingModal from './BookingModal'

export default function Hero() {
  const [showBooking, setShowBooking] = useState(false)

  const scrollToFacility = () => {
    const element = document.getElementById('facility')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section id="home" className="pt-[120px] pb-12 md:pb-20 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-brand-canvas border border-brand-gold rounded-full">
                <span className="text-xs font-semibold text-brand-navy">
                  Professional Mental Health & Rehabilitation Facility
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-h1-mobile md:text-h1-desktop text-brand-navy">
                A Journey to Healing, A Future of Possibilities
              </h1>

              {/* Description */}
              <p className="text-body-mobile md:text-body-desktop text-brand-text">
                Providing professional mental care, rehabilitation support, counseling, and structured community intervention in a safe, quiet environment.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="btn-primary"
                >
                  Request Appointment
                </button>
                <button
                  onClick={scrollToFacility}
                  className="btn-secondary"
                >
                  View Facility Tour
                </button>
              </div>

              {/* Contact Quick Strip */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-brand-border">
                <a
                  href="tel:0703653555"
                  className="flex items-center gap-2 text-brand-green font-semibold hover:text-brand-navy transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  0703 653 555
                </a>
                <a
                  href="tel:0702492050"
                  className="flex items-center gap-2 text-brand-green font-semibold hover:text-brand-navy transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  0702 492 050
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-green/10 to-brand-gold/10 rounded-radius-lg p-8">
                <div className="relative bg-brand-canvas rounded-radius-lg overflow-hidden aspect-video">
                  <Image
                    src="/images/facility-5.jpg"
                    alt="JG Impact facility"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-brand-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
                Location: Kenyatta Road, Juja, Behind Muigai Inn
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
      )}
    </>
  )
}
