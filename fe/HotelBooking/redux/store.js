import {configureStore} from '@reduxjs/toolkit';
import { globalSlice } from './Globalreducer';

const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
