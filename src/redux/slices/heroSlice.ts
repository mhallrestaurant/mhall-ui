import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/api';

interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: string;
  cta?: {
    text: string;
    action: 'order' | 'reserve' | 'cater';
  };
}

interface HeroConfig {
  title: string;
  subtitle?: string;
  [key: string]: any;
}

interface HeroSection {
  config: HeroConfig;
  slides: HeroSlide[];
  featured: any | null;
}

interface HeroState {
  section: HeroSection | null;
  slides: HeroSlide[];
  config: HeroConfig | null;
  featured: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: HeroState = {
  section: null,
  slides: [],
  config: null,
  featured: null,
  loading: false,
  error: null,
};

/**
 * Fetch complete hero section from database
 * - Config (title, subtitle)
 * - Slides (carousel items from Promotions or Featured MenuItems)
 * - Featured (main promotion banner)
 */
export const fetchHeroSection = createAsyncThunk(
  'hero/fetchSection',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else if (data.data) {
        return data.data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch hero section';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch just the hero slides
 */
export const fetchHeroSlides = createAsyncThunk(
  'hero/fetchSlides',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero/slides`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else if (Array.isArray(data.data)) {
        return data.data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch hero slides';
      return rejectWithValue(message);
    }
  }
);

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    clearHeroError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hero section
      .addCase(fetchHeroSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSection.fulfilled, (state, action) => {
        state.loading = false;
        state.section = action.payload;
        state.slides = action.payload.slides || [];
        state.config = action.payload.config || null;
        state.featured = action.payload.featured || null;
      })
      .addCase(fetchHeroSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load hero section';
      })
      // Fetch hero slides only
      .addCase(fetchHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload || [];
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load hero slides';
      });
  },
});

export const { clearHeroError } = heroSlice.actions;
export default heroSlice.reducer;
