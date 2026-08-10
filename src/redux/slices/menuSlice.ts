import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem, MenuCategory } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface HomePageMenuCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
  displayOrder: number;
  items: MenuItem[];
}

interface MenuState {
  items: MenuItem[];
  categories: MenuCategory[];
  homePageMenu: HomePageMenuCategory[];
  loading: boolean;
  homePageMenuLoading: boolean;
  error: string | null;
  homePageMenuError: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  homePageMenu: [],
  loading: false,
  homePageMenuLoading: false,
  error: null,
  homePageMenuError: null,
};

export const fetchMenuItems = createAsyncThunk('menu/fetchItems', async (params: { includeUnavailable?: boolean } = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.includeUnavailable) queryParams.append('includeUnavailable', 'true');
    const response = await fetch(`${API_BASE_URL}/admin/menu-items?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch menu items';
    return rejectWithValue(message);
  }
});

export const fetchCategories = createAsyncThunk('menu/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return rejectWithValue(message);
  }
});

/**
 * Fetch home page menu organized by categories
 * - Direct from production database
 * - No hardcoded data
 * - Cached on server side
 * - Used by DynamicMenu component
 */
export const fetchHomePageMenu = createAsyncThunk(
  'menu/fetchHomePageMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu-items/public/home`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (data.success && data.data) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch menu';
      return rejectWithValue(message);
    }
  }
);

export const createMenuItem = createAsyncThunk('menu/create', async (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt' | 'slug'>, { rejectWithValue }) => {
  try {
    // Transform frontend data to match backend schema and generate slug from name
    const backendData = {
      name: itemData.name,
      slug: itemData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      categoryId: Number(itemData.categoryId),
      shortDescription: itemData.shortDescription || undefined,
      description: itemData.description || undefined,
      productType: itemData.productType || 'FOOD',
      price: Number(itemData.price),
      imageUrl: itemData.image || undefined,
      images: itemData.images || [],
    };
      const response = await fetch(`${API_BASE_URL}/admin/menu-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create menu item';
    return rejectWithValue(message);
  }
});

export const updateMenuItem = createAsyncThunk('menu/update', async ({ id, ...itemData }: { id: number } & Partial<MenuItem>, { rejectWithValue }) => {
  try {
    // Transform frontend data to match backend schema
    const backendData: any = {};
    if (itemData.name !== undefined) backendData.name = itemData.name;
    if (itemData.shortDescription !== undefined) backendData.shortDescription = itemData.shortDescription;
    if (itemData.description !== undefined) backendData.description = itemData.description;
    if (itemData.productType !== undefined) backendData.productType = itemData.productType;
    if (itemData.price !== undefined) backendData.price = Number(itemData.price);
    if (itemData.image !== undefined) backendData.imageUrl = itemData.image;
    if (itemData.images !== undefined) backendData.images = itemData.images;
    if (itemData.categoryId !== undefined) backendData.categoryId = Number(itemData.categoryId);
    if (itemData.isAvailable !== undefined) backendData.isAvailable = itemData.isAvailable;
    if (itemData.isFeatured !== undefined) backendData.isFeatured = itemData.isFeatured;
      const response = await fetch(`${API_BASE_URL}/admin/menu-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update menu item';
    return rejectWithValue(message);
  }
});

export const deleteMenuItem = createAsyncThunk<string, number>('menu/delete', async (id: number) => {
  await fetch(`${API_BASE_URL}/admin/menu-items/${id}`, { method: 'DELETE' });
  return String(id);
});

export const toggleMenuItemAvailability = createAsyncThunk('menu/toggleAvailability', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/menu-items/${id}/availability`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle item availability';
    return rejectWithValue(message);
  }
});

export const createCategory = createAsyncThunk('menu/createCategory', async (categoryData: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return rejectWithValue(message);
  }
});

export const updateCategory = createAsyncThunk('menu/updateCategory', async ({ id, ...categoryData }: { id: number } & Partial<MenuCategory>, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return rejectWithValue(message);
  }
});

export const deleteCategory = createAsyncThunk<string, number>('menu/deleteCategory', async (id: number) => {
  await fetch(`${API_BASE_URL}/admin/categories/${id}`, { method: 'DELETE' });
  return String(id);
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
    clearHomePageMenuError: (state) => {
      state.homePageMenuError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((item: any) => ({
          ...item,
          image: item.imageUrl,
          shortDescription: item.shortDescription || undefined,
          productType: item.productType || 'FOOD',
        }));
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu items';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Home Page Menu handlers
      .addCase(fetchHomePageMenu.pending, (state) => {
        state.homePageMenuLoading = true;
        state.homePageMenuError = null;
      })
      .addCase(fetchHomePageMenu.fulfilled, (state, action) => {
        state.homePageMenuLoading = false;
        state.homePageMenu = (action.payload || []).map((category: any) => ({
          ...category,
          items: (category.items || []).map((item: any) => ({
            ...item,
            image: item.image || item.imageUrl || (item.images && item.images.length ? item.images[0] : undefined),
            shortDescription: item.shortDescription || undefined,
            productType: item.productType || 'FOOD',
          })),
        }));
      })
      .addCase(fetchHomePageMenu.rejected, (state, action) => {
        state.homePageMenuLoading = false;
        state.homePageMenuError = action.payload as string || 'Failed to load menu from database';
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        const newItem = {
          ...action.payload,
          image: action.payload.imageUrl,
          shortDescription: action.payload.shortDescription || undefined,
          productType: action.payload.productType || 'FOOD',
        };
        state.items.push(newItem);
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updatedItem = {
          ...action.payload,
          image: action.payload.imageUrl,
          shortDescription: action.payload.shortDescription || undefined,
          productType: action.payload.productType || 'FOOD',
        };
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(toggleMenuItemAvailability.fulfilled, (state, action) => {
        const updatedItem = {
          ...action.payload,
          image: action.payload.imageUrl,
          shortDescription: action.payload.shortDescription || undefined,
          productType: action.payload.productType || 'FOOD',
        };
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      });
  },
});

export const { clearMenuError, clearHomePageMenuError } = menuSlice.actions;
export default menuSlice.reducer;
