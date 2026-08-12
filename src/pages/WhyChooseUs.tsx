import React from 'react'
import heroImage from '../assets/chief.jpg'

const WhyChooseUs: React.FC = () => {
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
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Why Choose Us</h1>
            <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
              Excellence in every detail — from our Kanombe location to every plate we serve.
            </p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Fresh, Local Ingredients',
              description: 'We source the finest ingredients from Rwandan farmers and local producers, ensuring freshness and supporting our community with every dish.',
            },
            {
              title: 'Award-Winning Culinary Team',
              description: 'Our chefs bring passion, skill, and creativity to the kitchen, crafting menus that honor tradition while embracing innovation.',
            },
            {
              title: 'Warm, Welcoming Atmosphere',
              description: 'Located on the main street in Kanombe, ahead at East near 15, our restaurant offers a refined yet relaxed setting for every occasion.',
            },
            {
              title: 'Exceptional Service',
              description: 'From reservations to the last bite, our team is dedicated to making your experience seamless, memorable, and uniquely Moor Hall.',
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0 transition hover:-translate-y-1 hover:border-[#C8981A]/40"
              style={{ animation: `premiumFadeUp 0.75s ease-out forwards`, animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <h2 className="text-xl font-semibold text-[#BB0503]">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Our Promise</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Why guests return to Moor Hall</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Every visit to Moor Hall is an invitation to experience the best of Rwandan hospitality. From our location in Kanombe to the flavors on your plate, we strive for perfection in every detail. Whether it is a quick lunch, a family dinner, or a special celebration, we are here to make it unforgettable.
            </p>
            <ul className="mt-8 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">1</span>
                <span>Consistently fresh, high-quality ingredients in every dish.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">2</span>
                <span>A convenient Kanombe location on the main street, easy to find and hard to forget.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">3</span>
                <span>Personalized service that makes every guest feel at home.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Reservations</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Join us today</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Experience the Moor Hall difference. Reserve your table or reach out for private events and catering.
            </p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Location</p>
                <p className="mt-2 text-sm">Kanombe, Main Street, East near 15, Kigali, Rwanda</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Phone</p>
                <p className="mt-2 text-sm">+(250) 788 658 316</p>
                <p className="text-sm">+(250) 787 775 729</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Email</p>
                <p className="mt-2 text-sm">mhallrestaurant@gmail.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default WhyChooseUs