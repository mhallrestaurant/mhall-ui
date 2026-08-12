import React, { useState, useEffect } from 'react'
import heroImage from '../assets/chief.jpg'

const MissionValues: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
    setIsMobile(mobile)
  }, [])

  const phoneNumbers = [
    '+(250) 788 658 316',
    '+(250) 787 775 729',
  ]

  const primaryPhone = '250788658316'
  const email = 'mhallrestaurant@gmail.com'

  const emailHref = isMobile
    ? `mailto:${email}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`

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
      `}</style>

      <section className="relative overflow-hidden">
        <img src={heroImage} alt="Chef preparing premium dishes" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#BB0503]/90" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="max-w-3xl text-center mx-auto opacity-0" style={{ animation: 'premiumScaleIn 0.9s ease-out forwards', animationDelay: '0.15s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Moor Hall Restaurant</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Mission & Values</h1>
            <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
              Our mission has always been to share the joy of exceptional food and warm hospitality — rooted in Rwanda, inspired by the world.
            </p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.2s' }}>
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Our Mission</p>
          <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Culinary excellence with a Rwandan heart</h2>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            At Moor Hall, we believe great food starts with the best ingredients. We partner with local farmers and producers across Rwanda to ensure every plate is crafted with freshness, sustainability, and pride. From our kitchen in Kanombe to your table, we are committed to delivering premium meals that nourish both body and soul.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Our chef crafts each dish with care, ensuring every plate not only tastes extraordinary but looks beautiful too. Whether you are dining with us on the main street ahead at East near 15 or ordering for delivery, excellence is always on the menu.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Value 01</p>
            <h2 className="mt-4 text-2xl font-extrabold text-[#192333]">Quality First</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We source the freshest local ingredients to create dishes that celebrate Rwandan flavors and global culinary artistry.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Value 02</p>
            <h2 className="mt-4 text-2xl font-extrabold text-[#192333]">Hospitality</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Warm, genuine service is at the core of everything we do. Every guest is family at Moor Hall.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.5s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Value 03</p>
            <h2 className="mt-4 text-2xl font-extrabold text-[#192333]">Community</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              We are proud to be part of the Kanombe community, supporting local farmers and creating a space where people come together.
            </p>
          </div>
        </div>

        <section className="mt-10 rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Experience It</p>
          <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Ready to taste the difference?</h2>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Visit us at our Kanombe location on the main street ahead at East near 15, Kigali, Rwanda. We can not wait to welcome you and share our passion for exceptional food.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#BB0503] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a61a09]"
            >
              Call Us
            </a>
            <a
              href={emailHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#BB0503]/20 px-6 py-3 text-sm font-semibold text-[#BB0503] transition hover:bg-[#BB0503]/5"
            >
              Email Us
            </a>
          </div>
          <div className="mt-6 rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4 text-slate-600">
            <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Phone</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              {phoneNumbers.map((number) => (
                <a key={number} href={`tel:${number.replace(/[^0-9]/g, '')}`} className="transition hover:text-[#BB0503]">
                  {number}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MissionValues