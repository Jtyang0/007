import { configureStore } from '@reduxjs/toolkit';
import timeRecordSlice from './slices/timeRecordSlice';
import categorySlice from './slices/categorySlice';
import reportSlice from './slices/reportSlice';

const store = configureStore({
  reducer: {
    timeRecords: timeRecordSlice,
    categories: categorySlice,
    reports: reportSlice,
  },
});

export default store;

