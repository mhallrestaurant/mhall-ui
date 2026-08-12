import React from 'react'
import heroImage from '../assets/chief.jpg'

const OurStory: React.FC = () => {
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
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Our Story</h1>
            <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
              From a humble kitchen in Kanombe to a beloved dining destination — discover the journey behind Moor Hall.
            </p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.2s' }}>
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Our Beginning</p>
          <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">A dream rooted in Rwanda</h2>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Moor Hall Restaurant was founded with a simple yet powerful vision: to bring authentic, heartfelt cuisine to the heart of Kigali. Located on the main street in Kanombe, just ahead at East near 15, our restaurant stands as a beacon of warmth and flavor in the neighborhood.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            What began as a small family kitchen has blossomed into a destination where every dish tells a story of heritage, passion, and community. From the very first plate, we have remained committed to honoring Rwandan flavors while embracing culinary creativity.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.3s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Our Growth</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">From kitchen to community</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Over the years, Moor Hall has grown from a local favorite to a celebrated dining spot. Our commitment to quality ingredients, warm hospitality, and memorable experiences has earned us a special place in the hearts of our guests.
            </p>
            <ul className="mt-8 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">1</span>
                <span>Fresh, locally sourced ingredients from Rwandan farmers and producers.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">2</span>
                <span>A culinary team dedicated to preserving authentic flavors with a modern touch.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#BB0503]/10 text-[#BB0503]">3</span>
                <span>A welcoming atmosphere that feels like home for every guest who walks through our doors.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#BB0503]/10 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] opacity-0" style={{ animation: 'premiumFadeUp 0.8s ease-out forwards', animationDelay: '0.4s' }}>
            <p className="text-sm uppercase tracking-[0.35em] text-[#C8981A]">Visit Us</p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#192333]">Find Moor Hall</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              We are conveniently located in Kanombe, on the main street ahead at East near 15. Whether you are joining us for breakfast, lunch, dinner, or a special celebration, we look forward to welcoming you.
            </p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Location</p>
                <p className="mt-2 text-sm">Kanombe, Main Street, East near 15, Kigali, Rwanda</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Hours</p>
                <p className="mt-2 text-sm">Mon - Fri: 06:00 AM - 10:00 PM</p>
                <p className="text-sm">Saturday: 06:00 AM - 11:00 PM</p>
                <p className="text-sm">Sunday: 06:00 AM - 09:00 PM</p>
              </div>
              <div className="rounded-3xl border border-[#BB0503]/10 bg-[#fff7e6] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#BB0503]">Contact</p>
                <p className="mt-2 text-sm">+(250) 788 658 316</p>
                <p className="text-sm">+(250) 787 775 729</p>
                <p className="text-sm">mhallrestaurant@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OurStory