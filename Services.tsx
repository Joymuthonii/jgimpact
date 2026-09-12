'use client'

import {
  Brain,
  Users,
  Heart,
  Shield,
  Lightbulb,
  Repeat2,
  Microscope,
  Wind,
  Smile,
  BookOpen,
  Building2,
  Megaphone,
} from 'lucide-react'
import { useState } from 'react'

const SERVICES = [
  {
    id: 1,
    title: 'Mental Health Assessment & Counselling',
    icon: Brain,
    description: 'A confidential assessment and supportive counselling plan tailored to your emotional and mental health needs.',
  },
  {
    id: 2,
    title: 'Individual & Group Therapy',
    icon: Users,
    description: 'Guided therapy sessions that build insight, coping skills, and connection in an individual or group setting.',
  },
  {
    id: 3,
    title: 'Couples & Family Therapy',
    icon: Heart,
    description: 'Structured conversations that help couples and families improve communication, trust, and mutual support.',
  },
  {
    id: 4,
    title: 'Addiction Assessment & Treatment',
    icon: Shield,
    description: 'Professional assessment and recovery support for individuals affected by substance use and related challenges.',
  },
  {
    id: 5,
    title: 'Rehabilitation & Recovery Support',
    icon: Lightbulb,
    description: 'Practical guidance and a supportive environment for building healthy routines and lasting recovery.',
  },
  {
    id: 6,
    title: 'Aftercare & Relapse Prevention',
    icon: Repeat2,
    description: 'Ongoing follow-up and personalized strategies to maintain progress and manage future challenges.',
  },
  {
    id: 7,
    title: 'Psychological Assessment',
    icon: Microscope,
    description: 'Careful psychological evaluation to better understand strengths, concerns, and appropriate support options.',
  },
  {
    id: 8,
    title: 'Trauma & Grief Counselling',
    icon: Wind,
    description: 'Compassionate support for processing loss, trauma, and difficult life experiences at your own pace.',
  },
  {
    id: 9,
    title: 'Youth & Adolescent Support',
    icon: Smile,
    description: 'Age-appropriate support that helps young people navigate emotions, relationships, school, and change.',
  },
  {
    id: 10,
    title: 'Life Skills & Personal Development',
    icon: BookOpen,
    description: 'Practical tools for confidence, decision-making, communication, independence, and personal growth.',
  },
  {
    id: 11,
    title: 'Corporate Mental Health & Wellness',
    icon: Building2,
    description: 'Workplace wellness support that promotes healthier teams, stress management, and a positive work culture.',
  },
  {
    id: 12,
    title: 'Community Outreach & Training',
    icon: Megaphone,
    description: 'Mental health education and training that helps communities recognize concerns and respond with care.',
  },
]

export default function Services() {
  const [expandedService, setExpandedService] = useState<number | null>(null)

  return (
    <section id="services" className="py-16 md:py-24 px-4 md:px-0 bg-brand-canvas">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="section-header text-center mb-12">
          <h2 className="text-h2-mobile md:text-h2-desktop text-brand-navy mb-4">
            Services We Offer
          </h2>
          <p className="text-body-mobile md:text-body-desktop text-brand-text max-w-2xl mx-auto">
            Comprehensive mental health and rehabilitation services tailored to meet your unique needs.
            Our team of professionals is committed to supporting your journey to healing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                type="button"
                aria-expanded={expandedService === service.id}
                onClick={() => setExpandedService(
                  expandedService === service.id ? null : service.id
                )}
                className="card w-full p-6 text-left cursor-pointer hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6 text-brand-green" />
                  </div>
                  <h3 className="text-h3-mobile md:text-h3-desktop text-brand-navy">
                    {service.title}
                  </h3>
                </div>
                {expandedService === service.id && (
                  <p className="mt-4 border-t border-brand-border pt-4 text-sm leading-relaxed text-brand-text">
                    {service.description}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
