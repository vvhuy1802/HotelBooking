import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: "",
  isLoading: true,
  isDarkMode: false,
  announcement: [],
  typeMoney: "USD",
  stateSidebar: "Dashboard",
  totalHotel: [],
  totalOrder: [],
  totalUser: [],
};

export const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
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
    setTypeMoney: (state, action) => {
      state.typeMoney = action.payload;
    },
    setStateSidebar: (state, action) => {
      state.stateSidebar = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAnnouncement: (state, action) => {
      state.announcement.push(action.payload);
    },
    defaultAnnouncement: (state) => {
      state.announcement = [];
    },
  },
});

export const {
  setDarkMode,
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTypeMoney,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
  defaultAnnouncement
} = globalSlice.actions;

export default globalSlice.reducer;
