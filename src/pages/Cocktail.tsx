import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useGuestInteraction } from '../context/GuestInteractionContext'
import { useMenuItems } from '../hooks/useMenuItems'
import apiService from '../services/api'

const CocktailPage = () => {
  const navigate = useNavigate()
  const { quickCheckout } = useGuestInteraction()
  const { items: dbItems, loading } = useMenuItems('DRINK')

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
  const cocktails = dbItems.map(item => ({
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
            <h1 className="text-4xl font-bold text-gray-800">Cocktail Menu</h1>
            <p className="text-lg text-gray-600 mt-2">Crafted with premium spirits and fresh ingredients</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 text-xl">Loading menu...</div>
          ) : cocktails.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-xl">No cocktails available.</div>
          ) : (
          <>
          {/* Asymmetrical Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Bottom Left Featured Image */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="relative">
                <div className="relative bg-black p-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-2">
                    <div className="overflow-hidden shadow-2xl">
                      <img
                        src={cocktails[0]?.image || ''}
                        alt="Stylish Cocktail"
                        className="w-full h-80 object-cover transform -rotate-1 hover:rotate-0 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-500 rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Top Right Featured Image */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="relative">
                <div className="relative bg-black p-4 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white p-2">
                    <div className="overflow-hidden shadow-2xl">
                      <img
                        src={cocktails[1]?.image || cocktails[0]?.image || ''}
                        alt="Luxury Cocktails Display"
                        className="w-full h-96 object-cover transform rotate-1 hover:rotate-0 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full opacity-60"></div>
                <div className="absolute -top-4 -right-4 w-4 h-4 bg-orange-300 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {cocktails.map((item) => (
              <div key={item.id} onClick={() => navigate('/product', { state: { id: item.id, title: item.title, price: item.price, image: item.image, description: item.description } })} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200 cursor-pointer flex">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md border-2 border-gray-100">
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
          </>
          )}
        </div>
      </main>
    </div>
  )
}

export default CocktailPage