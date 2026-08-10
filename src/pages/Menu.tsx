import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import menuImg from '../assets/menu.jpg'
import betweenImg from '../assets/between.jpg'
import chiefImg from '../assets/chief.jpg'
import foodImg from '../assets/food.png'
import cokImg from '../assets/cok.jpg'
import { useGuestInteraction } from '../context/GuestInteractionContext'
import { useMenuItems } from '../hooks/useMenuItems'

const FOOD_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
const DRINK_BG = 'https://images.unsplash.com/photo-1551024709-8f23befc6f5d?auto=format&fit=crop&w=1200&q=80'

type CategoryId = 'all' | 'food' | 'coffee' | 'drinks' | 'bakery' | 'specials'
type Item = { id: string; title: string; price: string; image?: string; description?: string }

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'food', label: 'Food' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'specials', label: 'Specials' },
]

const CARD_OFFSETS = [-40, 60, -40, 60]
const CONNECTOR_HEIGHTS = CARD_OFFSETS.map(offset => 100 + offset)

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k Rwf`
  }
  return `${price} Rwf`
}

const parsePrice = (priceStr: string): number => {
  const cleaned = priceStr.toLowerCase().replace('k rwf', 'k').replace(' rwf', '').trim()
  const value = parseFloat(cleaned)
  return cleaned.includes('k') ? value * 1000 : value
}

const mapItem = (item: any, fallbackImage: string, fallbackDescription: string): Item => ({
  id: item.id,
  title: item.name,
  price: formatPrice(item.price),
  image: item.image || fallbackImage,
  description: item.description || item.shortDescription || fallbackDescription,
})

const productTypeToCategory = (pt?: string): CategoryId | undefined => {
  if (!pt) return undefined
  const normalized = pt.toString().toUpperCase().trim()
  switch (normalized) {
    case 'FOOD': return 'food'
    case 'COFFEE': return 'coffee'
    case 'DRINK':
    case 'DRINKS': return 'drinks'
    case 'BAKERY': return 'bakery'
    case 'SPECIAL':
    case 'SPECIALS': return 'specials'
    default: return undefined
  }
}

export default function Menu() {
  const location = useLocation()
  const navigate = useNavigate()
  const { quickCheckout } = useGuestInteraction()

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all')
  const [presetFilter, setPresetFilter] = useState<string | undefined>(undefined)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const preset = params.get('preset')?.toLowerCase()
    const typeParam = params.get('productType') || params.get('type')

    if (preset) {
      setPresetFilter(preset)
      setSelectedCategory(preset === 'breakfast' ? 'all' : 'food')
      return
    }

    setPresetFilter(undefined)
    setSelectedCategory(productTypeToCategory(typeParam) ?? 'all')
  }, [location.search])

  const { items: foodDbItems, loading: foodLoading } = useMenuItems('FOOD')
  const { items: drinkDbItems, loading: drinkLoading } = useMenuItems('DRINK')
  const { items: coffeeDbItems, loading: coffeeLoading } = useMenuItems('COFFEE')
  const { items: bakeryDbItems, loading: bakeryLoading } = useMenuItems('BAKERY')
  const { items: allDbItems, loading: allLoading } = useMenuItems()

  const loading = foodLoading || drinkLoading || coffeeLoading || bakeryLoading || allLoading

  const FOOD_ITEMS = useMemo(
    () => foodDbItems.map(item => mapItem(item, foodImg, 'A tasty food item from our menu.')),
    [foodDbItems],
  )

  const DRINK_ITEMS = useMemo(
    () => drinkDbItems.map(item => mapItem(item, cokImg, 'A refreshing drink to complement your meal.')),
    [drinkDbItems],
  )

  const COFFEE_ITEMS = useMemo(
    () => coffeeDbItems.map(item => mapItem(item, cokImg, 'A warm beverage to complement your meal.')),
    [coffeeDbItems],
  )

  const BAKERY_ITEMS = useMemo(
    () => bakeryDbItems.map(item => mapItem(item, foodImg, 'Freshly baked goods.')),
    [bakeryDbItems],
  )

  const SPECIALS_ITEMS = useMemo(
    () => foodDbItems
      .filter(item => item.isFeatured)
      .slice(0, 4)
      .map(item => mapItem(item, foodImg, 'A chef-selected special.')),
    [foodDbItems],
  )

  const MENU_ITEMS = useMemo(
    () => ({
      food: FOOD_ITEMS,
      coffee: COFFEE_ITEMS,
      drinks: DRINK_ITEMS,
      bakery: BAKERY_ITEMS,
      specials: SPECIALS_ITEMS,
    }),
    [FOOD_ITEMS, COFFEE_ITEMS, DRINK_ITEMS, BAKERY_ITEMS, SPECIALS_ITEMS],
  )

  const breakfastItems = useMemo(() => {
    if (presetFilter !== 'breakfast' || !Array.isArray(allDbItems)) return []

    const breakfastKeywords = ['omelette', 'pancakes', 'coffee', 'orange juice', 'croissant', 'toast', 'granola', 'bagel']

    return allDbItems
      .filter((item: any) => {
        if (!item?.name) return false
        const nameLower = String(item.name).toLowerCase()
        return breakfastKeywords.some(keyword => nameLower.includes(keyword))
      })
      .map((item: any) => mapItem(item, menuImg, item.description || item.shortDescription || 'A delicious breakfast favorite.'))
  }, [presetFilter, allDbItems])

  const selectedItems = useMemo(() => {
    if (presetFilter === 'breakfast') return breakfastItems
    return selectedCategory === 'all'
      ? Object.values(MENU_ITEMS).flat()
      : MENU_ITEMS[selectedCategory]
  }, [presetFilter, breakfastItems, selectedCategory, MENU_ITEMS])

  const selectedCategoryLabel = useMemo(
    () => (presetFilter === 'breakfast' ? 'Breakfast Collection' : CATEGORIES.find(cat => cat.id === selectedCategory)?.label ?? 'Menu'),
    [presetFilter, selectedCategory],
  )

  const handleOrderNow = useCallback(
    (item: Item, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      quickCheckout({
        id: `cart_${item.id}_${Date.now()}`,
        menuItemId: item.id,
        name: item.title,
        price: parsePrice(item.price),
        quantity: 1,
      })
    },
    [quickCheckout],
  )

  const renderPreviewCard = (title: string, items: Item[], image: string) => (
    <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.18)] border border-white/20 bg-white/60 backdrop-blur-lg">
      <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-3xl font-semibold tracking-[0.2em] drop-shadow">{title}</span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        {items.slice(0, 4).map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate('/product', { state: item })}
            className="w-full text-left rounded-2xl border border-gray-200 bg-white/75 backdrop-blur-sm px-3 py-3 transition hover:border-red-500 hover:bg-red-50"
          >
            <div className="flex items-center gap-4">
              <div className="min-w-[3.5rem] text-sm font-semibold text-gray-900">{item.title}</div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className="text-sm font-bold text-gray-800">{item.price}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-950 text-slate-50"
      style={{ backgroundImage: `url(${chiefImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Navbar />

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/80" />
        <img src={chiefImg} alt="Menu background" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Seasonal Chef Selections</p>
          <h1 className="mt-5 text-4xl font-extrabold uppercase tracking-[0.15em] text-white sm:text-5xl md:text-6xl">Moor Hall Menu</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            Discover refined dishes, barista-crafted beverages, and pastry creations curated for every moment of the day.
          </p>
          <div className="mt-8 flex justify-center">
            <a href="/menu/viewer" className="inline-flex rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
              View Full PDF Menu
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-2">
            {renderPreviewCard('Food', FOOD_ITEMS, FOOD_BG)}
            {renderPreviewCard('Drinks', DRINK_ITEMS, DRINK_BG)}
            {renderPreviewCard('Coffee', COFFEE_ITEMS, DRINK_BG)}
            {renderPreviewCard('Bakery', BAKERY_ITEMS, FOOD_BG)}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-red-600">Chef&apos;s Special</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Our Featured Specials</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                Hand-selected favorites designed to elevate every dining experience.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950/95 text-white shadow-[0_40px_120px_rgba(15,23,42,0.28)]">
              <img src={chiefImg} alt="Chef background" className="absolute inset-0 h-full w-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
              <div className="relative mx-auto max-w-7xl px-6 py-16">
                <div className="hidden md:grid">
                  {CARD_OFFSETS.map((_, index) => (
                    <div
                      key={index}
                      className="absolute left-1/4 w-px bg-red-500"
                      style={{ top: 0, height: `${CONNECTOR_HEIGHTS[index]}px`, left: `${12.5 + index * 25}%` }}
                    >
                      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-red-500 shadow-sm" />
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                  {loading ? (
                    <div className="col-span-full rounded-3xl border border-white/20 bg-slate-900/70 p-12 text-center text-lg text-white/80">
                      Loading specials...
                    </div>
                  ) : SPECIALS_ITEMS.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-white/20 bg-slate-900/70 p-12 text-center text-lg text-white/80">
                      No specials available right now.
                    </div>
                  ) : (
                    SPECIALS_ITEMS.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate('/product', { state: item })}
                        style={{ marginTop: `${CARD_OFFSETS[index % CARD_OFFSETS.length]}px` }}
                        className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/65 backdrop-blur-lg p-6 text-left shadow-[0_30px_70px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_35px_95px_rgba(15,23,42,0.25)]"
                      >
                        <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-inner">
                          <img src={item.image || menuImg} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <h3 className="text-center text-xl font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-center text-sm text-slate-600 min-h-[3rem]">{item.description}</p>
                        <div className="mt-8 flex flex-col gap-3 text-center">
                          <span className="text-lg font-semibold text-slate-900">{item.price}</span>
                          <button
                            type="button"
                            onClick={event => handleOrderNow(item, event)}
                            className="mx-auto inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Order Now
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/60 backdrop-blur-sm px-4 py-4 shadow-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${selectedCategory === cat.id ? 'bg-red-600 text-white shadow-xl' : 'bg-white text-slate-700 hover:bg-red-100 hover:text-red-700'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-[2rem] border border-white/20 bg-white/65 backdrop-blur-lg p-8 shadow-[0_30px_80px_rgba(15,23,42,0.17)]">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-red-600">Selected menu</p>
                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900">{selectedCategoryLabel}</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-slate-600">
                    Choose from our thoughtfully organized selection. Tap any item to view details, or order instantly from the menu.
                  </p>
                </div>

                {selectedItems.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                    We didn&apos;t find any items for that category yet. Please try another selection.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedItems.map(item => {
                      const [priceValue, priceUnit] = item.price.split(' ')
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigate('/product', { state: item })}
                          className="group flex w-full flex-col rounded-[1.5rem] border border-white/20 bg-white/65 backdrop-blur-sm p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-sm">
                              <img src={item.image || menuImg} alt={item.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-slate-900">{priceValue}</div>
                              <div className="text-sm text-slate-500">{priceUnit}</div>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={event => handleOrderNow(item, event)}
                              className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                              Order Now
                            </button>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
