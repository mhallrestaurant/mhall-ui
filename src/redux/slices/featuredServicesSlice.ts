import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

interface FeaturedService {
  id: number;
  name: string;
  slug: string;
  type: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FeaturedServicesState {
  items: FeaturedService[];
  loading: boolean;
  error: string | null;
}

const initialState: FeaturedServicesState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * Fetch all active featured services from public API
 * Cached on server side for 1 hour
 */
export const fetchFeaturedServices = createAsyncThunk(
  'featuredServices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/featured`);

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
      const message = error instanceof Error ? error.message : 'Failed to fetch featured services';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new featured service (admin)
 */
export const createFeaturedService = createAsyncThunk(
  'featuredServices/create',
  async (serviceData: Omit<FeaturedService, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/service-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create service';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update featured service (admin)
 */
export const updateFeaturedService = createAsyncThunk(
  'featuredServices/update',
  async ({ id, ...serviceData }: { id: number } & Partial<FeaturedService>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/service-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update service';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete featured service (admin)
 */
export const deleteFeaturedService = createAsyncThunk(
  'featuredServices/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/service-items/${id}`, {
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
      const message = error instanceof Error ? error.message : 'Failed to delete service';
      return rejectWithValue(message);
    }
  }
);

/**
 * Toggle featured service status (admin)
 */
export const toggleFeaturedServiceStatus = createAsyncThunk(
  'featuredServices/toggle',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/service-items/${id}/toggle`, {
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
      const message = error instanceof Error ? error.message : 'Failed to toggle service status';
      return rejectWithValue(message);
    }
  }
);

const featuredServicesSlice = createSlice({
  name: 'featuredServices',
  initialState,
  reducers: {
    clearFeaturedServicesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action: PayloadAction<FeaturedService[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeaturedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFeaturedService.fulfilled, (state, action: PayloadAction<FeaturedService>) => {
        state.items.push(action.payload);
      })
      .addCase(updateFeaturedService.fulfilled, (state, action: PayloadAction<FeaturedService>) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteFeaturedService.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(s => s.id !== action.payload);
      })
      .addCase(toggleFeaturedServiceStatus.fulfilled, (state, action: PayloadAction<FeaturedService>) => {
        const index = state.items.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearFeaturedServicesError } = featuredServicesSlice.actions;
export default featuredServicesSlice.reducer;
