import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取分类列表失败');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await categoryService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建分类失败');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoryService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新分类失败');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除分类失败');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
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
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

