'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Private Living Rooms & Therapy Lounge',
    image: 'facility-1.jpg',
  },
  {
    id: 2,
    title: 'Clean Residential Dormitory Accommodations',
    image: 'facility-2.jpg',
  },
  {
    id: 3,
    title: 'Modern Sanitation Facilities',
    image: 'facility-3.jpg',
  },
  {
    id: 4,
    title: 'Kitchen & Meal Preparation Facilities',
    image: 'facility-4.jpg',
  },
  {
    id: 5,
    title: 'Peaceful Facility Grounds',
    image: 'facility-5.jpg',
  },
  {
    id: 6,
    title: 'Comfortable Shared Spaces',
    image: 'facility-6.jpg',
  },
  {
    id: 7,
    title: 'Residential Accommodation',
    image: 'facility-7.jpg',
  },
  {
    id: 8,
    title: 'Therapy and Support Space',
    image: 'facility-8.jpg',
  },
  {
    id: 9,
    title: 'Welcoming Community Areas',
    image: 'facility-9.jpg',
  },
  {
    id: 10,
    title: 'JG Impact Facility',
    image: 'facility-10.jpg',
  },
]

export default function FacilityGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const showPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? GALLERY_ITEMS.length - 1 : index - 1))
  }

  const showNext = () => {
    setCurrentIndex((index) => (index === GALLERY_ITEMS.length - 1 ? 0 : index + 1))
  }

  const currentItem = GALLERY_ITEMS[currentIndex]

  return (
    <>
      <section id="facility" className="py-16 md:py-24 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-12">
            <h2 className="text-h2-mobile md:text-h2-desktop text-brand-navy mb-4">
              Inside Our Rehabilitation & Recovery Center
            </h2>
            <p className="text-body-mobile md:text-body-desktop text-brand-text max-w-2xl mx-auto">
              Explore our peaceful, residential spaces designed for comfort, community, and personal healing.
            </p>
          </div>

          {/* Gallery Carousel */}
          <div className="relative mx-auto max-w-4xl">
            <button
              onClick={() => setSelectedImage(currentItem.id)}
              className="group relative block w-full overflow-hidden rounded-radius-md cursor-pointer"
              aria-label={`View ${currentItem.title}`}
            >
              <div className="relative aspect-video bg-brand-canvas">
                <Image
                  key={currentItem.image}
                  src={`/images/${currentItem.image}`}
                  alt={currentItem.title}
                  fill
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 text-left">
                  <p className="text-sm font-semibold text-white md:text-base">
                    {currentItem.title}
                  </p>
                  <p className="mt-1 text-xs text-white/80">
                    {currentIndex + 1} of {GALLERY_ITEMS.length}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={showPrevious}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow hover:bg-white"
              aria-label="Previous facility photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={showNext}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow hover:bg-white"
              aria-label="Next facility photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="mt-4 flex justify-center gap-2" aria-label="Choose facility photo">
              {GALLERY_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-brand-green' : 'bg-brand-border hover:bg-brand-green/50'
                  }`}
                  aria-label={`Show photo ${index + 1}: ${item.title}`}
                  aria-current={index === currentIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-brand-gold transition-colors"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative bg-brand-canvas rounded-radius-md aspect-video overflow-hidden">
              <Image
                src={`/images/${GALLERY_ITEMS.find(item => item.id === selectedImage)?.image}`}
                alt={GALLERY_ITEMS.find(item => item.id === selectedImage)?.title || 'Facility photo'}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
