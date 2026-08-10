import React from 'react'

const OurStory: React.FC = () => {
  return (
     <div className="min-h-screen pt-24 sm:pt-36 pb-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-700">Our Story</h1>
      
      <div className="rounded-2xl overflow-hidden mb-8 max-w-4xl mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200&h=400"
          alt="Our story"
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="text-xl leading-relaxed max-w-5xl mx-auto">
        <p className="mb-6">Moor Hall Restaurant was founded with a passion for bringing authentic culinary experiences to our community. What started as a small family kitchen has grown into a beloved dining destination.</p>
        <p className="mb-6">Every recipe tells a story, every dish carries our heritage. We invite you to be part of our journey.</p>
      </div>
    </div>
  )
}

export default OurStory