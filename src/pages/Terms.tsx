import React from 'react'
import heroImage from '../assets/chief.jpg'

interface TermSection {
  title: string
  content: string[]
}

const TERMS_SECTIONS: TermSection[] = [
  {
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using the Moor Hall website and services, you agree to be bound by these Terms and Conditions.',
      'If you do not agree to these terms, please do not use this website or our services.',
      'These terms apply to all visitors, users, and others who access or use our services.',
    ],
  },
  {
    title: 'Website Use and Content',
    content: [
      'All content provided on this website is for general information and use only.',
      'We reserve the right to modify, suspend, or discontinue any part of the website at any time without notice.',
      'Unauthorized use of this website may give rise to a claim for damages or constitute a criminal offense.',
    ],
  },
  {
    title: 'Reservations and Orders',
    content: [
      'All reservations and orders are subject to availability and confirmation by Moor Hall.',
      'We recommend booking in advance for a seamless dining experience. Reservations are held for 10 minutes after the scheduled time before being released.',
      'Cancellations must be made at least 4 hours before the scheduled reservation time to avoid cancellation fees.',
      'We accept card, mobile payments, and select digital wallets. Prices are inclusive of applicable taxes.',
    ],
  },
  {
    title: 'Google Tag Manager and Analytics',
    content: [
      'This website uses Google Tag Manager and Google Analytics to understand visitor behavior and improve our services.',
      'By using this website, you agree to Google\'s Terms of Service, Privacy Policy, and the Google Tag Manager Use Policy.',
      'For more information on how Google uses data, please visit https://www.google.com/policies/privacy/.',
      'You may opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content, trademarks, logos, and intellectual property on this website are owned by Moor Hall or our licensors.',
      'You may not reproduce, distribute, or create derivative works from any content on this website without express written permission.',
      'Unauthorized use may violate copyright, trademark, and other applicable laws.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'Moor Hall shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website.',
      'We do not warrant that the website will be uninterrupted, secure, or error-free.',
      'Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.',
    ],
  },
  {
    title: 'Privacy and Data Protection',
    content: [
      'Your use of this website is also governed by our Privacy Policy.',
      'We collect and process personal data in accordance with applicable data protection laws, including GDPR.',
      'We do not sell your personal data to third parties without your explicit consent.',
    ],
  },
  {
    title: 'Governing Law',
    content: [
      'These Terms and Conditions shall be governed by and construed in accordance with the laws of Rwanda.',
      'Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Rwanda.',
    ],
  },
  {
    title: 'Changes to Terms',
    content: [
      'We reserve the right to update or modify these Terms and Conditions at any time without prior notice.',
      'Continued use of the website after any changes constitutes acceptance of the new terms.',
      'We encourage you to review these terms periodically.',
    ],
  },
]

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fffdf8_0%,_#fff7e6_100%)] text-slate-800">
      <style>{`
        @keyframes premiumFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes premiumScaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes premiumGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 205, 70, 0); }
          50% { box-shadow: 0 0 35px rgba(255, 205, 70, 0.1); }
        }
      `}</style>

      <section className="relative overflow-hidden">
        <img src={heroImage} alt="Chef preparing premium dishes" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#BB0503]/90" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-3xl text-center mx-auto opacity-0" style={{ animation: 'premiumScaleIn 0.9s ease-out forwards', animationDelay: '0.15s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Moor Hall Restaurant</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Terms & Conditions</h1>
            <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
              Please read these terms carefully before using our website and services. By accessing Moor Hall, you agree to comply with these conditions.
            </p>
            <p className="mt-2 text-sm text-white/60">Last updated: August 2026</p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TERMS_SECTIONS.map((section, index) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0 transition hover:-translate-y-1 hover:border-[#C8981A]/40"
              style={{ animation: `premiumFadeUp 0.75s ease-out forwards`, animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <h2 className="text-xl font-semibold text-[#BB0503]">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BB0503]/10 text-xs font-semibold text-[#BB0503]">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Compliance & Standards</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Our commitment to transparency</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Moor Hall operates in full compliance with applicable Rwandan and international laws, including data protection regulations. We are committed to providing a safe, respectful, and legally compliant dining and digital experience for all our guests.
            </p>
            <ul className="mt-8 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">1</span>
                <span>We comply with GDPR and Rwandan data protection laws in all data handling practices.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">2</span>
                <span>We use industry-standard security measures to protect your personal and payment information.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">3</span>
                <span>We respect your privacy rights and provide clear options for data management and consent.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Need help?</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Contact our team</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              For questions about these terms, reservations, private events, or special requests, please reach out and our team will respond promptly.
            </p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">General enquiries</p>
                <p className="mt-2 text-sm">mhallrestaurant@gmail.com</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Reservations</p>
                <p className="mt-2 text-sm">+(250) 789 000 000</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Legal & Compliance</p>
                <p className="mt-2 text-sm">legal@moorhall.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Terms
