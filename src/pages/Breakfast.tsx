import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useGuestInteraction } from '../context/GuestInteractionContext'
import { useMenuItems } from '../hooks/useMenuItems'
import break1Img from '../assets/break1.jpg'
import break2Img from '../assets/break2.jpg'

// Known breakfast item names from the database (used for name-based filtering)
const BREAKFAST_ITEM_NAMES = [
  'Omelette', 'Pancakes', 'Coffee', 'Orange Juice', 'Croissant', 'Toast',
]

const BreakfastPage = () => {
  const navigate = useNavigate()
  const { quickCheckout } = useGuestInteraction()
  const { items: allDbItems, loading } = useMenuItems() // fetch all types

  // Filter to only breakfast items by name (breakfast page mixes FOOD + COFFEE types)
  const breakfastItems = allDbItems.filter(item =>
    BREAKFAST_ITEM_NAMES.some(name => item.name.toLowerCase().includes(name.toLowerCase()))
  )

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
  const menuItems = breakfastItems.map(item => ({
    id: item.id,
    title: item.name,
    price: formatPrice(item.price),
    image: item.image || break1Img,
    description: item.description || item.shortDescription || '',
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto mb-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Breakfast Menu</h1>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">Loading menu...</div>
          ) : breakfastItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl">No breakfast items available.</div>
          ) : (
          <>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Left Side - Featured Image */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <img src={break1Img} alt="Featured Breakfast" className="w-full h-130 object-cover" />
              </div>

            </div>

            {/* Right Side - Menu Cards */}
            <div className="space-y-4">
              {menuItems.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => navigate('/product', { state: { id: item.id, title: item.title, price: item.price, image: item.image, description: item.description } })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer flex">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
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

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Additional Menu Cards */}
            <div className="space-y-4 ">
              {menuItems.slice(4, 6).map((item) => (
                <div key={item.id} onClick={() => navigate('/product', { state: { id: item.id, title: item.title, price: item.price, image: item.image, description: item.description } })} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer flex">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
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

            {/* Right Side - Large Image */}
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img src={break2Img} alt="Croissant and Coffee" className="w-full h-120 object-cover" />
            </div>
          </div>
          </>
          )}
        </div>
      </main>

    </div>
  )
}

export default BreakfastPage