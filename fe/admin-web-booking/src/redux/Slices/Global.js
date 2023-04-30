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
  totalAdmin: [],
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
    setTotalAdmin: (state, action) => {
      state.totalAdmin = action.payload;
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
    removeAnnouncement: (state) => {
      state.announcement.shift();
    },
    updateData: (state, action) => {
      switch (action.payload.type) {
        case "hotel":
          state.totalHotel.push(action.payload.data);
          break;
        case "admin":
          state.totalAdmin.data.admin.push(action.payload.data);
          break;
        case "user":
          state.totalUser.data.users.push(action.payload.data);
          break;
        default:
          break;
      }
    },
    deleteData: (state, action) => {
      switch (action.payload.type) {
        case "hotel":
          state.totalHotel = state.totalHotel.filter(
            (item) => item._id !== action.payload.id
          );
          console.log('aaa')
          break;
        case "admin":
          state.totalAdmin.data.admin = state.totalAdmin.data.admin.filter(
            (item) => item._id !== action.payload.id
          );
          break;
        case "user":
          state.totalUser.data.users = state.totalUser.data.users.filter(
            (item) => item._id !== action.payload.id
          );
          break;
        default:
          break;
      }
    },
  },
});

export const {
  setDarkMode,
  setTotalHotel,
  setTotalOrder,
  setTotalUser,
  setTotalAdmin,
  setTypeMoney,
  setUserInfo,
  setStateSidebar,
  setIsLoading,
  setAnnouncement,
  removeAnnouncement,
  updateData,
  deleteData
} = globalSlice.actions;

export default globalSlice.reducer;

export const setAnnouncementAuto = (announcement) => (dispatch) => {
  dispatch(setAnnouncement(announcement));
  setTimeout(() => {
    dispatch(removeAnnouncement());
  }, 3500);
};
