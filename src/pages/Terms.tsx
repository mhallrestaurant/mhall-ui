import React from 'react'
import heroImage from '../assets/chief.jpg'

const TERMS_SECTION = [
  {
    title: 'Reservations',
    description: 'We recommend booking in advance for a seamless dining experience. Reservations are held for 10 minutes after the scheduled time before being released to waiting guests.',
  },
  {
    title: 'Cancellations',
    description: 'To support our kitchen and service team, please notify us at least 4 hours before your reservation if plans change. Late cancellations may be subject to a fee.',
  },
  {
    title: 'Payments',
    description: 'We accept card, mobile payments, and select digital wallets. A service charge may be applied for parties of 8 or more, and all prices are inclusive of applicable taxes.',
  },
  {
    title: 'Guest Conduct',
    description: 'Moor Hall is committed to a respectful dining atmosphere. We reserve the right to refuse service for disruptive or unsafe behavior to protect our guests and staff.',
  },
  {
    title: 'Private Events',
    description: 'For exclusive bookings and private dining, our team will provide a tailored agreement with custom menu, deposit, and cancellation terms.',
  },
  {
    title: 'Privacy',
    description: 'Your personal information is used only to manage reservations and order preferences. We never sell guest data and keep all information secure.',
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
              Our commitment is to deliver a polished dining experience with clarity, care and hospitality. These terms help ensure every visit feels exceptional and effortless.
            </p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TERMS_SECTION.map((section, index) => (
            <article
              key={section.title}
              className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0 transition hover:-translate-y-1 hover:border-[#C8981A]/40"
              style={{ animation: `premiumFadeUp 0.75s ease-out forwards`, animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <h2 className="text-xl font-semibold text-[#BB0503]">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{section.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Professional Standards</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Our promise to guests</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Moor Hall aims for a quiet, refined service environment. We ask guests to respect table times, honor requests, and allow our team to create an unforgettable culinary journey.
            </p>
            <ul className="mt-8 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">1</span>
                <span>Arrive on time to preserve the dining rhythm for all guests.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">2</span>
                <span>Share dietary requests ahead of time so we can personalize your menu.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">3</span>
                <span>Enjoy the evening with respect for our team, other guests, and the atmosphere.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Need help?</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Contact our concierge</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              For reservation changes, private events, or special requests, please reach out and our team will respond promptly with premium assistance.
            </p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">General enquiries</p>
                <p className="mt-2 text-sm">info@moorhall.com</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Reservations</p>
                <p className="mt-2 text-sm">+(250) 789 000 000</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Terms