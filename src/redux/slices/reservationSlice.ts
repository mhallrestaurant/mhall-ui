import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Reservation } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

export const fetchReservations = createAsyncThunk('reservations/fetchAll', async (params: { status?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/admin/reservations?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reservations';
    return rejectWithValue(message);
  }
});

export const updateReservationStatus = createAsyncThunk('reservations/updateStatus', async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update reservation';
    return rejectWithValue(message);
  }
});

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearReservationError: (state) => {
      state.error = null;
    },
    updateReservationInList: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reservations';
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      });
  },
});

export const { clearReservationError, updateReservationInList } = reservationSlice.actions;
export default reservationSlice.reducer;
