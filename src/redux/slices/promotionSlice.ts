import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

interface PromotionBase {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  startDate?: string;
  endDate?: string;
}

export interface PublicPromotion extends PromotionBase {}
export interface AdminPromotion extends PromotionBase {
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

type PromotionItem = PublicPromotion | AdminPromotion;

interface PromotionState {
  items: PromotionItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PromotionState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * Fetch all active promotions from public API
 * Cached on server side for 1 hour
 */
export const fetchPublicPromotions = createAsyncThunk(
  'promotion/fetchPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/promotions/public`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch promotions';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch promotions for admin panel (protected)
 */
export const fetchAdminPromotions = createAsyncThunk(
  'promotion/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/promotions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch admin promotions';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new promotion (admin)
 */
export const createPromotion = createAsyncThunk(
  'promotion/create',
  async (promotionData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/promotions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create promotion';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update promotion (admin)
 */
export const updatePromotion = createAsyncThunk(
  'promotion/update',
  async ({ id, ...promotionData }: { id: number } & Partial<Promotion>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update promotion';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete promotion (admin)
 */
export const deletePromotion = createAsyncThunk(
  'promotion/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete promotion';
      return rejectWithValue(message);
    }
  }
);

/**
 * Toggle promotion status (admin)
 */
export const togglePromotionStatus = createAsyncThunk(
  'promotion/toggle',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle promotion status';
      return rejectWithValue(message);
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    clearPromotionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPromotions.fulfilled, (state, action: PayloadAction<Promotion[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPublicPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdminPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminPromotions.fulfilled, (state, action: PayloadAction<Promotion[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPromotion.fulfilled, (state, action: PayloadAction<Promotion>) => {
        state.items.push(action.payload);
      })
      .addCase(updatePromotion.fulfilled, (state, action: PayloadAction<Promotion>) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePromotion.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(togglePromotionStatus.fulfilled, (state, action: PayloadAction<Promotion>) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearPromotionError } = promotionSlice.actions;
export default promotionSlice.reducer;
