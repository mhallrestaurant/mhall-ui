import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGuestInteraction } from '../../context/GuestInteractionContext'
import DynamicMenu from '../menu/DynamicMenu'
import { fetchFeaturedServices } from '../../redux/slices/featuredServicesSlice'
import { fetchPublicPromotions } from '../../redux/slices/promotionSlice'
import type { AppDispatch, RootState } from '../../redux/store'
import yoga from '../../assets/welcome.jpg'
import chief from '../../assets/chief.jpg'
import pizza from '../../assets/pizza.png'
import burger from '../../assets/burger.png'
import menu from '../../assets/menu.png'
import resto from '../../assets/resto.png'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { quickCheckout, openReservation, openCatering } = useGuestInteraction();
  
  // Fetch featured services and promotions
  const { items: featuredServices, loading: servicesLoading, error: servicesError } = useSelector((state: RootState) => state.featuredServices);
  const { items: promotions, loading: promotionsLoading, error: promotionsError } = useSelector((state: RootState) => state.promotions);

  useEffect(() => {
    dispatch(fetchFeaturedServices());
    dispatch(fetchPublicPromotions());
  }, [dispatch]);
  
  return (
    <div>
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      {/* Grainy texture background */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: '#e9e9e3',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'soft-light',
          opacity: 0.95,
          border: '4px solid #D4A017', 
        }}
      />
      
      {/* Bottom black textured section */}
      <div 
        className="absolute bottom-0 left-0 w-full h-48"
        style={{
          backgroundImage: `url(${chief})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
             
          clipPath: 'polygon(0 98%, 140% 0%, 100% 100%, 0 100% )'
        }}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
           
          }}
        />
       
      </div>

      {/* Gold border frame */}
    <div className="absolute inset-2 pointer-events-none z-10  rounded-xl" />

      <div className="relative z-0 max-w-screen-2xl mx-auto px-6 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center min-h-50">
          {/* Text Content */}
          <div className="rounded-4xl bg-white/95 border border-[#D4A017]/10 shadow-[0_32px_80px_rgba(0,0,0,0.12)] px-6 md:px-8 py-8 md:py-10 text-left" style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}>
            <h3 className="text-[#D4A017] text-2xl md:text-3xl font-semibold mb-4 tracking-[0.12em]">Welcome to</h3>
            <h2 className="text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">Moor Hall Restaurant</h2>
            
            <p className="text-slate-700 text-base md:text-lg leading-8 max-w-2xl mb-8 font-medium">
              Since 2019, Moor Hall has been serving bold, honest food made from fresh local ingredients. 
              Whether it's a quick lunch or a special occasion, we make every meal memorable.
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="text-slate-900 text-lg sm:text-xl md:text-2xl font-semibold">Customer reviews</p>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4A017]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
              <p className="text-slate-600 text-sm md:text-base font-medium">1000+ Happy Customers</p>
            </div>
          </div>



            {/* Image Column - welcome.jpg on right side */}
            <div className="flex justify-end md:justify-center">
              <div className="rounded-4xl border-8 border-[#D4A017] w-full max-w-2xl md:max-w-240 h-120 sm:h-128 md:h-152 overflow-hidden shadow-[0_32px_70px_rgba(0,0,0,0.18)]">
                <img 
                  src={yoga} 
                  alt="Restaurant welcome" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
        </div>
      </div>
    </section>
    <div>
      {/* Menu & Services Section with chief.jpg background */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* chief.jpg background cover */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${chief})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative mb-20 mt-5 z-40 max-w-screen-2xl mx-auto px-6 space-y-20">
          {/* Dynamic Menu from Database */}
          <DynamicMenu />

          {/* Featured Service (smaller top margin than meals) */}
          <div className="mt-16">
            <div className="w-full bg-slate-900/90 py-5 px-6 mb-4 rounded-3xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.14)]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundBlendMode: 'soft-light'
          }}>
              <h2 className="text-3xl md:text-4xl font-semibold text-white text-left">Featured Service</h2>
            </div>

            {/* Service Cards - Dynamic from Database */}
            {servicesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : servicesError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading services: {servicesError}</p>
              </div>
              ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                {featuredServices && featuredServices.length > 0 ? (
                  featuredServices.map((service) => (
                    <div key={service.id} className="bg-white/95 border border-[#D4A017]/15 rounded-[1.75rem] overflow-hidden flex flex-col h-full shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={service.imageUrl || resto} 
                          alt={service.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <h3 className="text-2xl font-semibold mb-3 text-slate-900">{service.name}</h3>
                          <p className="text-sm md:text-base text-slate-600 mb-6">{service.description}</p>
                        </div>
                        <button onClick={openReservation} className="bg-[#BF2201] text-white w-full py-3 rounded-full font-semibold tracking-[0.04em] hover:bg-[#a61a09] transition">Book Now</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-slate-600">No featured services available</p>
                )}
              </div>
            )}
          </div>

          {/* Promotional Offers Header */}
          <div className="w-full bg-slate-900/90 py-5 px-6 mb-6 rounded-3xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.14)]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundBlendMode: 'soft-light'
          }}>
            <h2 className="text-4xl font-semibold text-white text-left">Promotional Offers</h2>
          </div>

          {/* Offer Cards - Dynamic from Database */}
          {promotionsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading promotions...</p>
            </div>
          ) : promotionsError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading promotions: {promotionsError}</p>
            </div>
            ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              {promotions && promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <div key={promotion.id} className="bg-gray-200 border-4 border-[#D4A017] rounded-t-lg relative">
                    {promotion.discountPercentage && (
                      <div className="absolute right-4 top-4 w-20 h-20 bg-white rounded-full flex items-center justify-center z-10">
                        <span className="text-3xl font-bold text-red-600">{promotion.discountPercentage}%</span>
                      </div>
                    )}
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={promotion.imageUrl || burger} 
                        alt={promotion.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-4">{promotion.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="bg-white px-6 py-2 rounded-md">
                          {promotion.originalPrice && (
                            <span className="text-xl font-bold text-gray-400 line-through mr-2">
                              {Math.round(Number(promotion.originalPrice)).toLocaleString()}
                            </span>
                          )}
                          {promotion.discountedPrice && (
                            <span className="text-xl font-bold">
                              {Math.round(Number(promotion.discountedPrice)).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button onClick={() => quickCheckout({
                      id: `promo_${promotion.id}_${Date.now()}`,
                      menuItemId: promotion.id,
                      name: promotion.title,
                      price: promotion.discountedPrice ? Number(promotion.discountedPrice) : Number(promotion.originalPrice || 0),
                      quantity: 1,
                      notes: promotion.description || 'Promotion offer',
                      isPromotionOffer: true,
                    })} className="bg-red-600 text-white px-6 py-2 rounded-md font-bold">Order Now</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-slate-600">No promotions available</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
    </div>
  )
}


export default Home
