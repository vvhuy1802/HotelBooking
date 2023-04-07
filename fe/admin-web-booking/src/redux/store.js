import { configureStore } from "@reduxjs/toolkit";
import { globalSlice } from "./Slices/Global";
export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
  },
});
