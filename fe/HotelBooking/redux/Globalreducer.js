import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  userData: null,
  hotels:[],
  theme: 'light',
};
export default createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setHotels: (state, action) => {
      state.hotels = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  },
});
