import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
  const whatsappMessage = encodeURIComponent(
    'Hello JG Impact, I would like to inquire about booking a counseling session.'
  )
  const whatsappUrl = `https://wa.me/254703653555?text=${whatsappMessage}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow hover:scale-110 duration-200"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
