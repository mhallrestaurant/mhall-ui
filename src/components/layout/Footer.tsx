import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logomoor.png'
import footerBg from '../../assets/table.jpg'

const Footer: React.FC = () => {
  return (
    <footer
      className="relative overflow-hidden pt-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      style={{ backgroundImage: `url(${footerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-[#3f0201]/90" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-12">
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Logo & About */}
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <img src={logo} alt="Moor Hall Restaurant" className="mb-3 h-16 w-auto" />
            <p className="mb-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Moor Hall Restaurant offers authentic culinary experiences with fresh, locally sourced ingredients and exceptional hospitality.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Social Icons */}
              <a href="#" aria-label="WhatsApp" className="rounded-full bg-[#3f0201] p-2 transition-colors hover:bg-[#C8981A]">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full bg-[#3f0201] p-2 transition-colors hover:bg-[#C8981A]">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.5 7.46V5.56c0-.86.47-1.69 1.81-1.69h2.37V.68l-3.26-.06c-3.6 0-4.42 2.71-4.42 4.39v2.45H7v3.65h3.99V24h4.73V11.11h3.19l.86-3.65h-4.05z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-[#3f0201] p-2 transition-colors hover:bg-[#C8981A]">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="4"/>
                  <circle cx="12" cy="12" r="3"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="rounded-full bg-[#3f0201] p-2 transition-colors hover:bg-[#C8981A]">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <h3 className="mb-5 text-base font-semibold uppercase tracking-[0.18em] text-[#3f0201]">Quick Links</h3>
            <ul className="space-y-2 text-xs text-slate-600 sm:text-sm">
              <li><Link to="/" className="block transition-colors hover:text-[#3f0201]">Home</Link></li>
              <li><Link to="/menu/pizza" className="block transition-colors hover:text-[#3f0201]">Our Menu</Link></li>
              <li><Link to="/about/our-story" className="block transition-colors hover:text-[#3f0201]">About Us</Link></li>
              <li><Link to="/gallery/food" className="block transition-colors hover:text-[#3f0201]">Gallery</Link></li>
              <li><Link to="/services" className="block transition-colors hover:text-[#3f0201]">Services</Link></li>
              <li><Link to="/contact" className="block transition-colors hover:text-[#3f0201]">Contact</Link></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <h3 className="mb-5 text-base font-semibold uppercase tracking-[0.18em] text-[#3f0201]">Opening Hours</h3>
            <ul className="space-y-2 text-xs text-slate-600 sm:text-sm">
              <li className="flex justify-between"><span>Mon - Fri</span><span>06:00 AM - 10:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>06:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>06:00 AM - 9:00 PM</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="rounded-[2rem] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <h3 className="mb-5 text-base font-semibold uppercase tracking-[0.18em] text-[#3f0201]">Contact Us</h3>
            <ul className="space-y-3 text-xs text-slate-600 sm:text-sm">
              <li className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#C8981A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>25M6+9VF</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#C8981A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+(250)788 658 316</span>
                <span>+(250)787 775 729</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0 text-[#C8981A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>info@moorhall.com</span>
              </li>
            </ul>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!4v1783589346025!6m8!1m7!1s7_h935J_k0oDfwfrx6yIXA!2m2!1d-1.966454131559618!2d30.162203761095!3f190.50243!4f0!5f0.7820865974627469"
                className="h-48 w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Moor Hall location"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-white/80 sm:text-sm">
              © 2026 Moor Hall Restaurant. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-white/80 transition-colors hover:text-[#C8981A]">Terms & Conditions</Link>
              <a href="#" className="text-white/80 transition-colors hover:text-[#C8981A]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer