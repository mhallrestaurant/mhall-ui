import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { MenuCategory } from '../../types';

interface CategoryState {
  categories: MenuCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return rejectWithValue(message);
  }
});

export const createCategory = createAsyncThunk('categories/create', async (categoryData: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return rejectWithValue(message);
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, ...categoryData }: { id: number } & Partial<MenuCategory>, { rejectWithValue }) => {
  try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return rejectWithValue(message);
  }
});

export const deleteCategory = createAsyncThunk<string, number>('categories/delete', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return String(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return rejectWithValue(message);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
