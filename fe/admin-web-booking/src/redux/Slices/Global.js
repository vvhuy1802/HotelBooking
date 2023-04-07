import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
  totalHotel: [],
  totalOrder: [],
  totalUser: [],
};

export const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setTotalHotel: (state, action) => {
      state.totalHotel = action.payload;
    },
    setTotalOrder: (state, action) => {
      state.totalOrder = action.payload;
    },
    setTotalUser: (state, action) => {
      state.totalUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDarkMode, setTotalHotel, setTotalOrder, setTotalUser } =
  globalSlice.actions;

export default globalSlice.reducer;
