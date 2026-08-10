import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ContentBlock, PromoBanner } from '../../types';
import { API_BASE_URL } from '../../config/api';

interface ContentState {
  contentBlocks: ContentBlock[];
  promoBanners: PromoBanner[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  contentBlocks: [],
  promoBanners: [],
  loading: false,
  error: null,
};

export const fetchContentBlocks = createAsyncThunk('content/fetchBlocks', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/content/blocks`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content blocks';
    return rejectWithValue(message);
  }
});

export const updateContentBlock = createAsyncThunk('content/updateBlock', async (blockData: ContentBlock, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/content/blocks/${blockData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blockData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update content block';
    return rejectWithValue(message);
  }
});

export const fetchPromoBanners = createAsyncThunk('content/fetchPromoBanners', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/content/promo-banners`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch promo banners';
    return rejectWithValue(message);
  }
});

export const updatePromoBanner = createAsyncThunk('content/updatePromoBanner', async (bannerData: PromoBanner, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/content/promo-banners/${bannerData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update promo banner';
    return rejectWithValue(message);
  }
});

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearContentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentBlocks.fulfilled, (state, action) => {
        state.contentBlocks = action.payload;
      })
      .addCase(updateContentBlock.fulfilled, (state, action) => {
        const index = state.contentBlocks.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.contentBlocks[index] = action.payload;
        }
      })
      .addCase(fetchPromoBanners.fulfilled, (state, action) => {
        state.promoBanners = action.payload;
      })
      .addCase(updatePromoBanner.fulfilled, (state, action) => {
        const index = state.promoBanners.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.promoBanners[index] = action.payload;
        }
      });
  },
});

export const { clearContentError } = contentSlice.actions;
export default contentSlice.reducer;
