'use client'

import { useEffect, useState } from 'react'
import { X, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface BookingForm {
  service: string
  date: string
  time: string
  fullName: string
  phone: string
  email: string
  sessionType: string
}

const SERVICES = [
  'Mental Health Assessment & Counselling',
  'Individual & Group Therapy',
  'Couples & Family Therapy',
  'Addiction Assessment & Treatment',
  'Rehabilitation & Recovery Support',
  'Aftercare & Relapse Prevention',
  'Psychological Assessment',
  'Trauma & Grief Counselling',
  'Youth & Adolescent Support',
  'Life Skills & Personal Development',
  'Corporate Mental Health & Wellness',
  'Community Outreach & Training',
]

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '02:00 PM',
  '03:30 PM',
]

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookingForm>()

  const watchService = watch('service')
  const watchDate = watch('date')
  const watchTime = watch('time')
  const watchFullName = watch('fullName')
  const watchPhone = watch('phone')
  const watchSessionType = watch('sessionType')

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!isOpen) return null

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true)
    try {
      const [timeValue, meridiem] = data.time.split(' ')
      let [hours, minutes] = timeValue.split(':').map(Number)
      if (meridiem === 'PM' && hours !== 12) hours += 12
      if (meridiem === 'AM' && hours === 12) hours = 0
      const preferredDate = new Date(data.date)
      preferredDate.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email || undefined,
          phone: data.phone,
          serviceType: data.service,
          preferredDate: preferredDate.toISOString(),
          notes: `Session Type: ${data.sessionType}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit booking')
      }

      setIsSubmitted(true)
      setStep(4)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    setStep(1)
    setIsSubmitted(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-radius-md max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-brand-border bg-white">
          <h2 className="text-h3-desktop text-brand-navy">Book Appointment</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-brand-canvas rounded-radius-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-brand-navy" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Confirmation Screen
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-h3-desktop text-brand-navy mb-2">Request Submitted</h3>
              <p className="text-body-mobile text-brand-text mb-6">
                Our team will call you to confirm your booking within 24 hours.
              </p>
              <button
                onClick={handleClose}
                className="btn-primary w-full"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-h3-mobile font-semibold text-brand-navy mb-4">
                    Select Service
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {SERVICES.map((service) => (
                      <label key={service} className="flex items-center gap-3 p-3 rounded-radius-md hover:bg-brand-canvas cursor-pointer transition-colors">
                        <input
                          type="radio"
                          value={service}
                          {...register('service', { required: 'Service selection is required' })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-body-mobile text-brand-text">{service}</span>
                      </label>
                    ))}
                  </div>
                  {errors.service && (
                    <p className="text-red-600 text-sm">{errors.service.message}</p>
                  )}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full px-4 py-3 border border-brand-border rounded-radius-md focus:outline-none focus:border-brand-green"
                    />
                    {errors.date && (
                      <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map((time) => (
                        <label key={time} className="flex items-center">
                          <input
                            type="radio"
                            value={time}
                            {...register('time', { required: 'Time selection is required' })}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="ml-2 text-body-mobile text-brand-text cursor-pointer">
                            {time}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-red-600 text-sm mt-1">{errors.time.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 border border-brand-border rounded-radius-md focus:outline-none focus:border-brand-green"
                      placeholder="Your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-3 border border-brand-border rounded-radius-md focus:outline-none focus:border-brand-green"
                      placeholder="0700 000 000"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-brand-border rounded-radius-md focus:outline-none focus:border-brand-green"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-navy mb-3">
                      Session Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-radius-md hover:bg-brand-canvas cursor-pointer">
                        <input
                          type="radio"
                          value="in-person"
                          {...register('sessionType', { required: 'Session type is required' })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-body-mobile text-brand-text">
                          In-Person (Juja Center)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-radius-md hover:bg-brand-canvas cursor-pointer">
                        <input
                          type="radio"
                          value="online"
                          {...register('sessionType', { required: 'Session type is required' })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-body-mobile text-brand-text">
                          Online Session
                        </span>
                      </label>
                    </div>
                    {errors.sessionType && (
                      <p className="text-red-600 text-sm mt-1">{errors.sessionType.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {!isSubmitted && (
                <div className="flex gap-3 mt-8 pt-6 border-t border-brand-border">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 1 && !watchService) return
                        if (step === 2 && (!watchDate || !watchTime)) return
                        setStep(step + 1)
                      }}
                      disabled={
                        (step === 1 && !watchService) ||
                        (step === 2 && (!watchDate || !watchTime))
                      }
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      Next
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      disabled={isSubmitting || !watchFullName || !watchPhone}
                      className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
