import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ServiceItem } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface ServiceItemState {
  items: ServiceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceItemState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchServiceItems = createAsyncThunk('serviceItems/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/service-items`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch service items';
    return rejectWithValue(message);
  }
});

export const createServiceItem = createAsyncThunk('serviceItems/create', async (itemData: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/service-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create service item';
    return rejectWithValue(message);
  }
});

export const updateServiceItem = createAsyncThunk('serviceItems/update', async ({ id, ...itemData }: { id: number } & Partial<ServiceItem>, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/service-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update service item';
    return rejectWithValue(message);
  }
});

export const deleteServiceItem = createAsyncThunk<string, number>('serviceItems/delete', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/service-items/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return String(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete service item';
    return rejectWithValue(message);
  }
});

const serviceItemSlice = createSlice({
  name: 'serviceItems',
  initialState,
  reducers: {
    clearServiceItemError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServiceItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service items';
      })
      .addCase(createServiceItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateServiceItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteServiceItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearServiceItemError } = serviceItemSlice.actions;
export default serviceItemSlice.reducer;
