import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomePageMenu } from '../../redux/slices/menuSlice';
import type { RootState, AppDispatch } from '../../redux/store';
import type { MenuCategory, MenuItem } from '../../types';
import { useGuestInteraction } from '../../context/GuestInteractionContext';
import './DynamicMenu.css';

interface HomePageMenuCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
  displayOrder: number;
  items: MenuItem[];
}

/**
 * DynamicMenu Component
 * 
 * Fetches and displays menu items directly from the production database
 * - No hardcoded data
 * - Exact database representation
 * - Proper error handling
 * - Cache-aware loading
 * - Performance optimized
 * - Order Now modal integration
 */
const DynamicMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homePageMenu, homePageMenuLoading: loading, homePageMenuError: error } = useSelector((state: RootState) => state.menu);
  const { quickCheckout } = useGuestInteraction();

  useEffect(() => {
    // Fetch menu on component mount
    dispatch(fetchHomePageMenu());
  }, [dispatch]);

  // Keep a small, stable sorted menu for consistent rendering
  const sortedMenu = useMemo(() => {
    if (!homePageMenu) return [] as HomePageMenuCategory[];
    return [...homePageMenu].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [homePageMenu]);

  // Parse price for checkout (stable reference)
  const parsePrice = useCallback((price: number): number => price, []);

  // Handle Order Now button click (stable reference for children)
  const handleOrderNow = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item.isAvailable) return;

    quickCheckout({
      id: `cart_${item.id}_${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: parsePrice(item.price),
      quantity: 1,
    });
  }, [quickCheckout, parsePrice]);

  // Loading state
  if (loading) {
    return (
      <div className="menu-loading">
        <div className="menu-loader">
          <div className="spinner" />
          <p className="loading-small">Loading menu…</p>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error) {
    return (
      <div className="menu-error">
        <div className="error-container">
          <h3>Unable to Load Menu</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(fetchHomePageMenu())} className="retry-btn">
            Try Again
          </button>
          <details className="error-details">
            <summary>Troubleshooting</summary>
            <ul>
              <li>Check your internet connection</li>
              <li>Verify the server is running</li>
              <li>Check browser console for more details</li>
              <li>Server URL: /api/v1/menu-items/public/home</li>
            </ul>
          </details>
        </div>
      </div>
    );
  }

  // Empty state
  if (!homePageMenu || homePageMenu.length === 0) {
    return (
      <div className="menu-empty">
        <p>No menu items available at the moment</p>
      </div>
    );
  }

  return (
    <div className="dynamic-menu">
      <div className="menu-header">
        <h2 className='text-white'>Our Menu</h2>
        <p className="menu-subtitle">Fresh, local ingredients prepared daily</p>
      </div>

      <div className="menu-categories compact">
        {sortedMenu.map((category: HomePageMenuCategory) => (
          <section key={category.id} className="menu-category">
            <div className="category-header">
              <h3 className="category-name">{category.name}</h3>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
            </div>

            <div className="menu-items-grid compact">
              {category.items.map((item: MenuItem) => (
                <div
                  key={item.id}
                  className={`menu-item compact ${item.isFeatured ? 'featured' : ''} ${!item.isAvailable ? 'unavailable' : ''}`}
                  data-item-id={item.id}
                  role="listitem"
                >
                  {/* Item Image (compact) */}
                  <div className="item-image-container compact">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image compact"
                        loading="lazy"
                        width={120}
                        height={80}
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="item-image-placeholder compact">
                        <span>No image</span>
                      </div>
                    )}
                    {item.isFeatured && (
                      <div className="featured-badge small">Featured</div>
                    )}
                  </div>

                  {/* Item Details (condensed) */}
                  <div className="item-details compact">
                    <div className="item-header compact">
                      <h4 className="item-name">{item.name}</h4>
                      <span className="item-price">
                        {new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(item.price)}
                      </span>
                    </div>

                    {/* Short description prioritized */}
                    {(item.shortDescription || item.description) && (
                      <p className="item-short-desc compact">{item.shortDescription ?? item.description}</p>
                    )}

                    {/* Metadata */}
                    <div className="item-metadata compact">
                      {item.preparationTime && (
                        <span className="prep-time">⏱ {item.preparationTime}m</span>
                      )}
                      {!item.isAvailable && <span className="unavailable-badge">Unavailable</span>}
                      {(item.isHandmade || item.isHandcrafted || item.tags?.includes?.('handmade')) && (
                        <span className="handmade-badge">Handmade</span>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      className="add-to-cart-btn compact"
                      disabled={!item.isAvailable}
                      onClick={(e) => handleOrderNow(item, e)}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      {item.isAvailable ? 'Order Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      
    </div>
  );
};

export default DynamicMenu;
