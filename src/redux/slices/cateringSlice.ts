import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

// Define the types for the catering state
interface CateringState {
  items: any[]; // Replace 'any' with proper CateringRequest type when available
  loading: boolean;
  error: string | null;
}

const initialState: CateringState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks for catering operations (placeholders)
export const fetchCateringRequests = createAsyncThunk(
  'catering/fetchCateringRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/catering`);
      if (!response.ok) {
        throw new Error('Failed to fetch catering requests');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

export const createCateringRequest = createAsyncThunk(
  'catering/createCateringRequest',
  async (cateringData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/catering`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cateringData),
      });
      if (!response.ok) {
        throw new Error('Failed to create catering request');
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

export const updateCateringRequest = createAsyncThunk(
  'catering/updateCateringRequest',
  async ({ id, ...cateringData }: { id: string } & Partial<any>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/catering/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cateringData),
      });
      if (!response.ok) {
        throw new Error('Failed to update catering request');
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

export const deleteCateringRequest = createAsyncThunk(
  'catering/deleteCateringRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await fetch(`${API_BASE_URL}/catering/${id}`, { method: 'DELETE' });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

const cateringSlice = createSlice({
  name: 'catering',
  initialState,
  reducers: {
    clearCateringError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCateringRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCateringRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCateringRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch catering requests';
      })
      .addCase(createCateringRequest.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCateringRequest.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCateringRequest.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearCateringError } = cateringSlice.actions;

// Selectors - using generic typing to avoid circular dependency
export const selectCateringRequests = (state: { catering: CateringState }) => state.catering.items;
export const selectCateringLoading = (state: { catering: CateringState }) => state.catering.loading;
export const selectCateringError = (state: { catering: CateringState }) => state.catering.error;

export default cateringSlice.reducer;