import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { SiteSetting } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface SettingsState {
  settings: SiteSetting[];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: [],
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/settings`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return rejectWithValue(message);
  }
});

export const updateSetting = createAsyncThunk('settings/update', async (settingData: SiteSetting, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/settings/${settingData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    return rejectWithValue(message);
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    updateSettingInList: (state, action: PayloadAction<SiteSetting>) => {
      const index = state.settings.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.settings[index] = action.payload;
      } else {
        state.settings.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateSetting.fulfilled, (state, action) => {
        const index = state.settings.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      });
  },
});

export const { clearSettingsError, updateSettingInList } = settingsSlice.actions;
export default settingsSlice.reducer;
