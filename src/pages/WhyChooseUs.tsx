import React from 'react'

const WhyChooseUs: React.FC = () => {
  return (
     <div className="min-h-screen pt-24 sm:pt-36 pb-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-700">Why Choose Us</h1>
      
      <div className="rounded-2xl overflow-hidden mb-8 max-w-4xl mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200&h=400"
          alt="Why choose us"
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="text-xl leading-relaxed max-w-5xl mx-auto">
        <p className="mb-6">At Moor Hall, we believe in excellence in every detail. From our locally sourced ingredients to our expertly trained staff, we strive for perfection in everything we do.</p>
        <ul className="list-disc pl-8 mb-6">
          <li className="mb-2">Fresh, local ingredients daily</li>
          <li className="mb-2">Award winning culinary team</li>
          <li className="mb-2">Warm, welcoming atmosphere</li>
          <li className="mb-2">Exceptional customer service</li>
        </ul>
      </div>
    </div>
  )
}

export default WhyChooseUs