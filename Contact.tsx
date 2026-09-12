'use client'

import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSubmitMessage('Thank you! We have received your message and will get back to you soon.')
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })

      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitMessage('Failed to send message. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="contact" className="py-16 md:py-24 px-4 md:px-0 bg-brand-canvas">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-h2-mobile md:text-h2-desktop text-brand-navy mb-4">
                Get in Touch
              </h2>
              <p className="text-body-mobile md:text-body-desktop text-brand-text">
                We are here to support your journey to healing. Reach out to us for inquiries, appointments, or any questions about our services.
              </p>
            </div>

            {/* Location Card */}
            <div className="card p-6">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-brand-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Location</h3>
                  <p className="text-body-mobile text-brand-text mb-3">
                    Kenyatta Road, Juja<br />
                    Behind Muigai Inn<br />
                    Kiambu County, Kenya<br />
                    <span className="text-sm">1°07&apos;27.4&quot;S 37°00&apos;22.0&quot;E</span>
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=-1.1242778%2C37.0061111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-green font-semibold hover:text-brand-navy transition-colors text-sm"
                  >
                    Get Directions
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="card p-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-brand-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-navy mb-3">Phone</h3>
                  <div className="space-y-2">
                    <a
                      href="tel:0703653555"
                      className="flex items-center gap-2 text-brand-green font-semibold hover:text-brand-navy transition-colors text-sm"
                    >
                      0703 653 555
                    </a>
                    <a
                      href="tel:0702492050"
                      className="flex items-center gap-2 text-brand-green font-semibold hover:text-brand-navy transition-colors text-sm"
                    >
                      0702 492 050
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="card p-6">
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-brand-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-brand-navy mb-2">Email</h3>
                  <a
                    href="mailto:journeyimpact@gmail.com"
                    className="text-brand-green font-semibold hover:text-brand-navy transition-colors text-sm"
                  >
                    journeyimpact@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="card p-0 overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=-1.1242778%2C37.0061111&output=embed"
              width="100%"
              height="100%"
              style={{ minHeight: '400px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="mt-16 card p-8">
          <h2 className="text-h2-mobile md:text-h2-desktop text-brand-navy mb-4">
            Send us a Message
          </h2>
          <p className="text-body-mobile md:text-body-desktop text-brand-text mb-8">
            Have questions? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {submitMessage && (
            <div className={`p-4 rounded mb-6 ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-border rounded focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-border rounded focus:outline-none focus:border-brand-green"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-border rounded focus:outline-none focus:border-brand-green"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-brand-border rounded focus:outline-none focus:border-brand-green"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-brand-border rounded focus:outline-none focus:border-brand-green resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full md:w-auto disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
