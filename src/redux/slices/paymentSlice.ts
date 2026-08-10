import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Payment, PaymentRecord } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface PaymentState {
  payments: Payment[];
  paymentRecords: PaymentRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  paymentRecords: [],
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk('payments/fetchAll', async (params: { orderId?: number; page?: number; limit?: number } = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.orderId) queryParams.append('orderId', params.orderId.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/admin/payments?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch payments';
    return rejectWithValue(message);
  }
});

export const verifyPayment = createAsyncThunk('payments/verify', async ({ id, status, note }: { id: number; status: 'VERIFIED' | 'REJECTED'; note?: string }, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/payments/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify payment';
    return rejectWithValue(message);
  }
});

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    addPaymentRecord: (state, action: PayloadAction<PaymentRecord>) => {
      state.paymentRecords.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload;
        }
      });
  },
});

export const { clearPaymentError, addPaymentRecord } = paymentSlice.actions;
export default paymentSlice.reducer;
