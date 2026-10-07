'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import BookingModal from './BookingModal'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-brand-border z-50 h-[72px]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-14 h-14 rounded-radius-sm overflow-hidden bg-white">
            <Image
              src="/images/JG-logo.jpg"
              alt="JG Impact logo"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
          <div className="text-sm font-bold text-brand-navy hidden sm:block">
            JG Impact
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#home" className="text-brand-text hover:text-brand-green transition-colors">
            Home
          </a>
          <a href="#services" className="text-brand-text hover:text-brand-green transition-colors">
            Services
          </a>
          <a href="#facility" className="text-brand-text hover:text-brand-green transition-colors">
            Facility
          </a>
          <a href="#contact" className="text-brand-text hover:text-brand-green transition-colors">
            Contact
          </a>
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <a
            href="tel:0703653555"
            className="text-brand-green font-medium text-sm hover:text-brand-navy transition-colors"
          >
            0703 653 555
          </a>
          <button className="btn-primary text-sm" onClick={() => setShowBooking(true)}>
            Book Appointment
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-brand-navy" />
          ) : (
            <Menu className="w-6 h-6 text-brand-navy" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-brand-border">
          <div className="flex flex-col p-4 gap-4">
            <a href="#home" className="text-brand-text hover:text-brand-green">
              Home
            </a>
            <a href="#services" className="text-brand-text hover:text-brand-green">
              Services
            </a>
            <a href="#facility" className="text-brand-text hover:text-brand-green">
              Facility
            </a>
            <a href="#contact" className="text-brand-text hover:text-brand-green">
              Contact
            </a>
            <hr className="border-brand-border" />
            <a href="tel:0703653555" className="text-brand-green font-medium">
              0703 653 555
            </a>
            <button className="btn-primary w-full" onClick={() => setShowBooking(true)}>
              Book Appointment
            </button>
          </div>
        </div>
      )}
      {showBooking && (
        <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
      )}
    </nav>
  )
}
