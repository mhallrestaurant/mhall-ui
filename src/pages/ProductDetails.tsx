import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGuestInteraction } from '../context/GuestInteractionContext'

type Addon = {
  name: string;
  price: number;
}

type Size = {
  name: string;
  price: number;
}

const ProductDetails: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state
  const { quickCheckout } = useGuestInteraction()

  const [quantity, setQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'circle'>('initial')

  useEffect(() => {
    const timer = setTimeout(() => setAnimationPhase('circle'), 6000)
    return () => clearTimeout(timer)
  }, [])

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>
  }

  const parsePrice = (priceStr: string) => {
    const num = parseFloat(priceStr.replace('k', '').replace(' Rwf', ''));
    return priceStr.includes('k') ? num * 1000 : num;
  }

  const basePrice = parsePrice(product.price)

  const addons: Addon[] = [
    { name: 'Extra cheese', price: 5000 },
    { name: 'Mushrooms', price: 3000 },
    { name: 'Olives', price: 2000 },
    { name: 'Grilled chicken', price: 4000 }
  ]

  const addonPrice = selectedAddons.reduce((sum, addonName) => {
    const addon = addons.find(a => a.name === addonName)
    return sum + (addon ? addon.price : 0)
  }, 0)
  const totalPrice = (basePrice + addonPrice) * quantity

  const handleAddonChange = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName)
        ? prev.filter(name => name !== addonName)
        : [...prev, addonName]
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleConfirmOrder = () => {
    const notes = selectedAddons.length > 0 ? `Addons: ${selectedAddons.join(', ')}` : undefined;

    quickCheckout({
      id: `cart_${product.id}_${Date.now()}`,
      menuItemId: product.id,
      name: product.title,
      price: (basePrice + addonPrice), // Price per item including addons
      quantity: quantity,
      notes: notes
    })
  }

  return (
    <div className=" mt-40">
      <div className="h-full mt- max-w-7xl mx-auto px-4 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <div className="h-full md:flex">
            <div className="md:w-1/2 h-full flex flex-col">
              <motion.img
                src={product.image}
                alt={product.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              />
              <div className="mt-6 px-4 mb-10">
                <h2 className="text-2xl font-bold mb-4">About product</h2>
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                <button onClick={handleConfirmOrder} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-gray-400">Order Now</button>
                <button onClick={() => navigate(-1)} className="ml-10 bg-[#C8961A] text-white px-4 py-2 rounded-lg hover:bg-gray-700 ">Back</button>
              </div>

            </div>

            <div className="md:w-1/2 h-full flex items-center justify-center px-8">
              <div className="relative w-full max-w-sm h-96 flex items-center justify-center">
                <motion.img
                  src={product.image}
                  alt="Related product view 1"
                  className="w-70 h-70 object-cover rounded-lg shadow-md cursor-pointer absolute"
                  style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    x: [0, 0, 80, 0],
                    y: [0, 60, 60, 0]
                  }}
                  transition={{
                    delay: 0.2,
                    duration: 0.5,
                    x: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.img
                  src={product.image}
                  alt="Related product view 2"
                  className="w-70 h-70 object-cover rounded-lg shadow-md cursor-pointer absolute"
                  style={{ bottom: '10%', left: '10%' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    x: [0, 60, 0, 0],
                    y: [0, -60, -60, 0]
                  }}
                  transition={{
                    delay: 0.4,
                    duration: 0.5,
                    x: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                  }}
z                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.img
                  src={product.image}
                  alt="Related product view 3"
                  className="w-70 h-70 object-cover rounded-lg shadow-md cursor-pointer absolute"
                  style={{ bottom: '10%', right: '10%' }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    x: [0, -60, -80, 0],
                    y: [0, -60, 0, 0]
                  }}
                  transition={{
                    delay: 0.6,
                    duration: 0.5,
                    x: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails