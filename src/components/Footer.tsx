import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-14 h-14 bg-white rounded-radius-sm overflow-hidden">
                <Image
                  src="/images/JG-logo.jpg"
                  alt="JG Impact logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <span className="font-bold">JG Impact</span>
            </div>
            <p className="text-white/80 text-sm">
              A Journey to Healing, A Future of Possibilities
            </p>
            <p className="text-white/80 text-sm">
              Kenyatta Road, Juja<br />
              Behind Muigai Inn<br />
              Kiambu County, Kenya
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-white/80 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#facility" className="text-white/80 hover:text-white transition-colors">
                  Facility
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact & Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                <span className="font-semibold text-white">Emergency Support:</span><br />
                <a href="tel:0703653555" className="text-brand-green hover:text-white transition-colors">
                  0703 653 555
                </a>
              </p>
              <p className="text-white/80 text-xs mt-4">
                Confidentiality Notice: All patient information and interactions with JG Impact are treated with the utmost confidentiality in accordance with professional ethics and local regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
          <p>
            © {currentYear} JG Impact Ltd. All rights reserved.
          </p>
          <a href="/admin" className="text-brand-gold hover:text-white transition-colors text-xs">
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  )
}
