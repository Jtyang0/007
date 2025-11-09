import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from '../../services/reportService';

const initialState = {
  report: null,
  loading: false,
  error: null,
};

export const generateReport = createAsyncThunk(
  'reports/generate',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.generate(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '生成报表失败');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReport: (state) => {
      state.report = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReport, clearError } = reportSlice.actions;
export default reportSlice.reducer;

