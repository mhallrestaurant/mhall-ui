import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useGuestInteraction } from '../context/GuestInteractionContext'
import { useMenuItems } from '../hooks/useMenuItems'

const LunchPage = () => {
  const navigate = useNavigate()
  const { quickCheckout } = useGuestInteraction()
  const { items: dbItems, loading } = useMenuItems('FOOD')

  const parsePrice = (priceStr: string) => {
    const clean = priceStr.replace('k', '').replace(' Rwf', '').trim()
    const num = parseFloat(clean)
    return priceStr.includes('k') ? num * 1000 : num
  }

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k Rwf`
    }
    return `${price} Rwf`
  }

  const handleOrderNow = (item: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const price = parsePrice(item.price)
    quickCheckout({
      id: `cart_${item.id}_${Date.now()}`,
      menuItemId: item.id,
      name: item.title,
      price,
      quantity: 1,
    })
  }

  // Map DB items to the shape expected by the page
  const lunchItems = dbItems.map(item => ({
    id: item.id,
    title: item.name,
    price: formatPrice(item.price),
    image: item.image || '',
    description: item.description || item.shortDescription || '',
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto mb-10">
             {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Lunch Menu</h1>
            <p className="text-lg text-gray-600 mt-2">Grilled to perfection with fresh ingredients</p>
          </div>
          {/* Hero Banner Section - Two large side-by-side images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img src={lunchItems[0]?.image || lunchItems[1]?.image || ''} alt="Grilled Meat Platter" className="w-full h-80 lg:h-96 object-cover" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              <img src={lunchItems[1]?.image || lunchItems[0]?.image || ''} alt="BBQ Feast" className="w-full h-80 lg:h-96 object-cover" />
            </div>
          </div>
          {/* Menu Section */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">Loading menu...</div>
          ) : lunchItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl">No lunch items available.</div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {lunchItems.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => navigate('/product', { state: { id: item.id, title: item.title, price: item.price, image: item.image, description: item.description } })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 cursor-pointer flex">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="text-lg font-bold text-orange-600">{item.price}</div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <button onClick={(e) => handleOrderNow({ id: item.id, title: item.title, price: item.price, image: item.image, description: item.description }, e)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-700 transition">Order Now</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {lunchItems.slice(4, 8).map((item) => (
                <div key={item.id} onClick={() => navigate('/product', { state: { id: item.id, title: item.title, price: item.price, image: item.image, description: item.description } })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 cursor-pointer flex">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="text-lg font-bold text-orange-600">{item.price}</div>
                  </div>
                  <div className="ml-4 flex items-center">
                    <button onClick={(e) => handleOrderNow({ id: item.id, title: item.title, price: item.price, image: item.image, description: item.description }, e)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold hover:bg-red-700 transition">Order Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LunchPage