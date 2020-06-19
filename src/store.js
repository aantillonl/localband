import { configureStore } from '@reduxjs/toolkit';
import searchBoxSlice from './searchBoxSlice';

const store = configureStore({
  reducer: searchBoxSlice.reducer,
});

export default store;
