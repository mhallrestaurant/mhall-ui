import React from 'react'

const MissionValues: React.FC = () => {
  return (
     <div className="min-h-screen pt-24 sm:pt-36 pb-16 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-700">Mission and Values</h1>
      
      <div className="rounded-2xl overflow-hidden mb-8 max-w-4xl mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=1200&h=400"
          alt="Restaurant mission"
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="text-xl leading-relaxed max-w-5xl mx-auto mb-10">
        <p className="mb-6">We believe that Great Food starts with the Best ingredients. we partner with local Farmers to surely we produce Good product. Sustainable premium meals. our chef craft each dish with care to ensuring every plate also look Beautiful.</p>
      
        <p className="text-2xl italic text-gray-700 text-center my-10">" our mission has always Been to share . a joy of exceptional food and warm Hospitality."</p>

        <h2 className="text-3xl font-bold text-center mb-8">culinary Excellence</h2>

        <p className="text-center text-xl">'Ready To Experience exceptional dining. Reserve your Table to day & be aparty</p>
      </div>
    </div>
  )
}

export default MissionValues