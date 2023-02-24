import {configureStore} from '@reduxjs/toolkit';
import Globalreducer from './Globalreducer';

const store = configureStore({
  reducer: {
    Globalreducer: Globalreducer.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
