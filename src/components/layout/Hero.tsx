import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGuestInteraction } from '../../context/GuestInteractionContext'
import { fetchHeroSection } from '../../redux/slices/heroSlice'
import type { RootState, AppDispatch } from '../../redux/store'

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: string;
  cta?: {
    text: string;
    action: 'order' | 'reserve' | 'cater';
  };
}

const textVariant = (delay = 0) => ({
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 0.75, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.5, ease: 'easeInOut' } },
})

const badgeVariant = (delay = 0) => ({
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { delay, duration: 0.75, ease: 'easeInOut' } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.5, ease: 'easeInOut' } },
})

const imageVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: (delay = 0.6) => ({ opacity: 1, y: 0, transition: { delay, duration: 0.9, ease: 'easeInOut' } }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeInOut' } },
}

const stripeVariant = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 0.2, y: 0, transition: { duration: 0.9, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeInOut' } },
}

const floatY = (d = 4) => ({
  animate: { y: [0, -10, 0], rotate: [0, 4, 0] },
  transition: { duration: d, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
})

/**
 * Hero Component
 * 
 * Fully data-driven from database (ContentSection + Promotion models)
 * - No hardcoded slides
 * - Auto-fetches hero config and slides from API
 * - Redis cached for performance
 * - Graceful error handling with fallback
 */
const Hero: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { slides, loading, error } = useSelector((state: RootState) => state.hero)
  const [index, setIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const { quickCheckout, openReservation, openCatering } = useGuestInteraction()

  // Menu PDF prefetching and fast-open helpers
  const menuPdfPathRaw = '/MOOR HALL RESTAURANT MENU_.pdf'
  const [menuBlobUrl, setMenuBlobUrl] = useState<string | null>(null)
  const prefetchingRef = useRef(false)

  const prefetchMenuPdf = async () => {
    if (menuBlobUrl || prefetchingRef.current) return
    prefetchingRef.current = true
    try {
      const res = await fetch(encodeURI(menuPdfPathRaw), { cache: 'force-cache' })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setMenuBlobUrl(url)
    } catch (err) {
      // silent fail; opening fallback will still work
    }
  }

  useEffect(() => {
    // hint browser to prefetch the PDF with low priority
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = encodeURI(menuPdfPathRaw)
    link.as = 'document'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
      if (menuBlobUrl) {
        URL.revokeObjectURL(menuBlobUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenMenuPdf = () => {
    if (menuBlobUrl) {
      window.open(menuBlobUrl, '_blank')
      return
    }

    // fallback: open hosted PDF while starting a background prefetch
    window.open(encodeURI(menuPdfPathRaw), '_blank')
    void prefetchMenuPdf()
  }

  // Fetch hero data on mount
  useEffect(() => {
    dispatch(fetchHeroSection())
  }, [dispatch])

  // Auto-rotate slides
  useEffect(() => {
    if (!slides || slides.length === 0) return
    
    const t = setInterval(() => {
      if (!isScrolling) {
        setIndex((i) => (i + 1) % slides.length)
      }
    }, 6000)
    return () => clearInterval(t)
  }, [isScrolling, slides])

  // Wheel scroll navigation
  useEffect(() => {
    if (!slides || slides.length === 0) return

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return
      
      setIsScrolling(true)
      if (e.deltaY > 0) {
        setIndex((i) => (i + 1) % slides.length)
      } else {
        setIndex((i) => (i - 1 + slides.length) % slides.length)
      }
      
      setTimeout(() => setIsScrolling(false), 800)
    }

    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.addEventListener('wheel', handleWheel, { passive: true })
    }
    
    return () => {
      if (heroSection) {
        heroSection.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isScrolling, slides])

  // Touch swipe navigation
  useEffect(() => {
    if (!slides || slides.length === 0) return

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return
      
      const touchEndY = e.changedTouches[0].clientY
      const diffY = touchStartY - touchEndY
      
      if (Math.abs(diffY) > 50) {
        setIsScrolling(true)
        if (diffY > 0) {
          setIndex((i) => (i + 1) % slides.length)
        } else {
          setIndex((i) => (i - 1 + slides.length) % slides.length)
        }
        
        setTimeout(() => setIsScrolling(false), 800)
      }
    }

    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.addEventListener('touchstart', handleTouchStart, { passive: true })
      heroSection.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
    
    return () => {
      if (heroSection) {
        heroSection.removeEventListener('touchstart', handleTouchStart)
        heroSection.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isScrolling, slides])

  // Loading state
  if (loading) {
    return (
      <section className="relative w-full h-96 bg-gradient-to-r from-[#BB0503] to-[#BB0503] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#BB0503] border-t-[#D4A017] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading hero content...</p>
        </div>
      </section>
    )
  }

  // Error state
  if (error || !slides || slides.length === 0) {
    return (
      <section className="relative w-full h-96 bg-gradient-to-r from-[#BB0503] to-[#BB0503] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-white text-lg mb-4">
            {error || 'Hero content not available'}
          </p>
          <button
            onClick={() => dispatch(fetchHeroSection())}
            className="bg-[#D4A017] hover:bg-[#C8961A] text-white px-6 py-2 rounded transition"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  const current = slides[index]

  const handleOrderNow = () => {
    navigate('/menu')
  };

  const handleCTA = () => {
    if (!current.cta) {
      handleOrderNow()
      return
    }

    switch (current.cta.action) {
      case 'order':
        handleOrderNow()
        break
      case 'reserve':
        openReservation()
        break
      case 'cater':
        openCatering()
        break
      default:
        handleOrderNow()
    }
  };
  return (
    <section id="hero-section" className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Vertical stripe that animates from up with the image */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div key={current.id + '-stripe'} className="absolute inset-y-0 right-40 h-autho -translate-x-1/2 w-36 md:w-56 bg-[#fffb11] pointer-events-none" variants={stripeVariant} initial="hidden" animate="visible" exit="exit" style={{ transform: 'translateX(-50%)' }} />
        </AnimatePresence>
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left navigation arrow */}
        <button 
          onClick={() => !isScrolling && setIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="absolute  md:left-0 top-1/2 -translate-y-1/2 w-12 h-12 border border-white hover:bg-[#C8961A] rounded-full flex items-center justify-center text-white transition-all z-20 "
          aria-label="Previous slide"
        >
          <svg className="w-6  h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right navigation arrow */}
        <button 
          onClick={() => !isScrolling && setIndex((i) => (i + 1) % slides.length)}
          className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 w-12 h-12 border border-white hover:bg-[#C8961A] rounded-full flex items-center justify-center text-white transition-all z-20"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
         {/* Left: text content (staggered from up) */}
         <div className="text-left h-full flex flex-col justify-center py-6 min-h-80 sm:min-h-105">
           <div className="min-h-2.5 sm:min-h-17">
             <AnimatePresence mode="wait">
               <motion.div key={current.id + '-badge'} initial="hidden" animate="visible" exit="exit" variants={badgeVariant(0)}>
                 <div className="inline-block  border font-bold border-white text-white text-sm md:text-lg rounded-md px-4 md:px-6 py-1 md:py-2 mb-2 sm:mb-6">
                   {`${current.price ? `JUST ${current.price}` : 'FEATURED'}`}
                 </div>
               </motion.div>
             </AnimatePresence>
           </div>

           <div className="min-h-20 sm:min-h-45">
             <AnimatePresence mode="wait">
             <motion.h1 key={current.id + '-title'} className="text-2xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight drop-shadow-lg whitespace-pre-line" initial="hidden" animate="visible" exit="exit" variants={textVariant(0.12)}>
               {current.title}
             </motion.h1>
             </AnimatePresence>
           </div>

           <div className="min-h-10 sm:min-h-20">
             <AnimatePresence mode="wait">
               <motion.p key={current.id + '-desc'} className="mt-2 text-white/90 max-w-lg text-base md:text-lg font-semibold" initial="hidden" animate="visible" exit="exit" variants={textVariant(0.28)}>
                 {current.description}
               </motion.p>
             </AnimatePresence>
           </div>

           <div className="min-h-5 sm:min-h-12.5">
             <AnimatePresence mode="wait">
              <motion.div key={current.id + '-cta'} className="mt-4 flex flex-col sm:flex-row gap-2 items-center" initial="hidden" animate="visible" exit="exit" variants={textVariant(0.44)}>
                <div className="flex gap-2">
                  <button
                    onClick={handleCTA}
                    className="bg-[#BF2201] hover:bg-[#A01B00] text-white font-bold px-4 md:px-6 py-2 rounded-md shadow-lg transition-all duration-300"
                  >
                    {current.cta?.text || 'Order Now'}
                  </button>
                  <button
                    onClick={openReservation}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-4 md:px-6 py-2 rounded-md shadow-lg transition-all duration-300"
                  >
                    Reserve Table
                  </button>
                  <button
                    onClick={handleOpenMenuPdf}
                    onMouseEnter={() => void prefetchMenuPdf()}
                    onFocus={() => void prefetchMenuPdf()}
                    onTouchStart={() => void prefetchMenuPdf()}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold px-4 md:px-6 py-2 rounded-md shadow-lg transition-all duration-300"
                  >
                    View Menu (PDF)
                  </button>
                </div>
                <button
                  onClick={openCatering}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-md transition-all duration-300 text-sm"
                >
                  Request Catering
                </button>
              </motion.div>
             </AnimatePresence>
           </div>
         </div>

         {/* Right: animated food images */}
            <div className="flex items-center justify-center relative h-full py-6 sm:py-8 min-h-80 sm:min-h-105">
           {/* floating element (small) - show only if image exists */}
           {current.image && (
             <motion.div className="absolute -top-4 -right-6 sm:-top-6 sm:-right-10 md:-right-16" animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }} transition={{ duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}>
               <img src={current.image} alt="floating" className="w-10 h-10 mt-6 sm:mt-10 md:w-14 md:h-14 rounded-full object-cover shadow-lg border-2 border-white/20" />
             </motion.div>
           )}

           <div className="relative w-full min-h-60 sm:min-h-80 md:min-h-112.5 flex items-center justify-center overflow-visible">
             <AnimatePresence mode="wait">
               <motion.div key={current.id + '-img'} className="w-full h-full flex items-center justify-center" variants={imageVariant} initial="hidden" animate="visible" exit="exit">
                 {current.image ? (
                   <motion.img 
                     src={current.image} 
                     alt={current.title} 
                     className="max-w-full max-h-70 sm:max-h-95 md:max-h-125 w-auto h-auto object-contain drop-shadow-2xl" 
                     initial={{ scale: 1 }} 
                     animate={{ scale: 1.02 }} 
                     transition={{ duration: 12, ease: 'easeInOut' }} 
                     style={{ imageRendering: 'auto' }}
                     onError={(e) => { e.currentTarget.style.display = 'none' }}
                   />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                     <p className="text-white/50">No image available</p>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
           </div>
         </div>
      </div>

      {/* Scroll indicator dots */}
      <div className="absolute bottom- left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => !isScrolling && setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === i 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* subtle decorative shapes */}
      <svg className="absolute right-8 bottom-4 opacity-25 pointer-events-none" width="220" height="220" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd7b0" />
            <stop offset="100%" stopColor="#ff9a6b" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#g2)" />
        <circle cx="120" cy="110" r="40" fill="#ffb19a" />
      </svg>
    </section>
  )
}

export default Hero
