import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import type { MenuItem } from '../types';

/**
 * Map backend MenuItem fields to frontend MenuItem type.
 * Backend: imageUrl (string), price (number), productType (uppercase)
 * Frontend: image (string), price (string like "15k Rwf"), productType (uppercase)
 */
function mapBackendToFrontend(item: any): MenuItem {
  return {
    id: String(item.id),
    categoryId: String(item.categoryId),
    name: item.name,
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description || '',
    productType: item.productType,
    price: item.price,
    image: item.imageUrl || undefined,
    images: item.images,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    preparationTime: item.preparationTime,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function useMenuItems(productType?: string) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPublicMenuItems(
        productType ? { productType } : undefined
      );
      const data = response.data?.data || [];
      const mapped = (Array.isArray(data) ? data : []).map(mapBackendToFrontend);
      setItems(mapped);
    } catch (err: any) {
      console.error('Failed to fetch menu items:', err);
      setError(err?.message || 'Failed to load menu items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [productType]);

  useEffect(() => {
    fetchItems();
  }, [productType]);

  return { items, loading, error, refetch: fetchItems };
}
