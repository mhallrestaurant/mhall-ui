import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Define the types for the dashboard state
interface DashboardState {
  stats: {
    overview: {
      totalOrders: number;
      totalCustomers: number;
      totalMenuItems: number;
      totalCategories: number;
      totalRevenue: string;
      todayOrders: number;
      todayRevenue: string;
      totalReservations: number;
      totalCateringRequests: number;
    };
    ordersByStatus: {
      REQUESTED: number;
      CONFIRMED: number;
      PREPARING: number;
      READY: number;
      COMPLETED: number;
      CANCELLED: number;
    };
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      customer: { name: string };
      createdAt: string;
      total: number;
      status: string;
    }>;
    popularItems: Array<{
      name: string;
      count: number;
    }>;
    revenueByDay: Array<{
      date: string;
      amount: number;
    }>;
    paymentSummary: {
      partial: number;
      paid: number;
      failed: number;
      cancelled: number;
    };
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

// Async thunk to fetch dashboard stats
  export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiService.getDashboardStats();
        // Assuming the API returns { success: true, data: {...} }
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
      }
    }
  );

  export const resetRevenue = createAsyncThunk(
    'dashboard/resetRevenue',
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiService.resetRevenue();
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to reset revenue');
        }
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
      }
    }
  );

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch dashboard stats';
      })
      .addCase(resetRevenue.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(resetRevenue.rejected, (state, action) => {
        state.error = action.payload as string || action.error.message || 'Failed to reset revenue';
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

// Selectors - using generic RootState to avoid circular dependency
export const selectDashboardStats = (state: { dashboard: DashboardState }) => state.dashboard.stats;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.loading;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;

export default dashboardSlice.reducer;