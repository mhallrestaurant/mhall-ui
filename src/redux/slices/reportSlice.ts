import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

interface ReportData {
  revenue: Record<string, string>;
  orders: Record<string, number>;
  topItems: { name: string; quantity: number }[];
}

interface ReportState {
  data: ReportData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk('reports/fetch', async (params: { startDate: string; endDate: string }, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);

    const response = await fetch(`${API_BASE_URL}/admin/reports?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reports';
    return rejectWithValue(message);
  }
});

export const fetchRevenueStats = createAsyncThunk('reports/fetchRevenue', async (params: { period?: 'daily' | 'weekly' | 'monthly' } = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);

    const response = await fetch(`${API_BASE_URL}/admin/reports/revenue?${queryParams}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch revenue stats';
    return rejectWithValue(message);
  }
});

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
