import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { timeRecordService } from '../../services/timeRecordService';

const initialState = {
  records: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchTimeRecords = createAsyncThunk(
  'timeRecords/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await timeRecordService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取时间记录失败');
    }
  }
);

export const createTimeRecord = createAsyncThunk(
  'timeRecords/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await timeRecordService.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建时间记录失败');
    }
  }
);

export const updateTimeRecord = createAsyncThunk(
  'timeRecords/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await timeRecordService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新时间记录失败');
    }
  }
);

export const deleteTimeRecord = createAsyncThunk(
  'timeRecords/delete',
  async (id, { rejectWithValue }) => {
    try {
      await timeRecordService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除时间记录失败');
    }
  }
);

const timeRecordSlice = createSlice({
  name: 'timeRecords',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTimeRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTimeRecord.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      })
      .addCase(updateTimeRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(deleteTimeRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r._id !== action.payload);
      });
  },
});

export const { clearError } = timeRecordSlice.actions;
export default timeRecordSlice.reducer;

