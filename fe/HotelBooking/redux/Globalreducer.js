import {createSlice} from '@reduxjs/toolkit';
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const initialState = {
  userData: null,
  hotels: [],
  theme: 'light',
  user_position: {
    latitude: 0,
    longitude: 0,
  },
  booking_date: {
    check_in: today,
    check_out: tomorrow.toISOString().split('T')[0],
    total_night: 1,
  },
  hotelData: [],
  payment_method: {
    id: 'payment-hotel',
    name: 'Thanh toán tại khách sạn',
    image:
      'https://cdn1.iconfinder.com/data/icons/condominium-juristic-management/64/Common_fee-fee-money-condominium-512.png',
    available: true,
  },
  notification: [],
};
export const globalSlice = createSlice({
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
    },
    setUserPosition: (state, action) => {
      state.user_position = action.payload;
      console.log('User Position', state.user_position);
    },
    setBookingDate: (state, action) => {
      state.booking_date = action.payload;
    },
    addComment: (state, action) => {
      let hotel = state.hotels.filter(hotel => hotel.id === action.payload.id);
      hotel[0].comments.push(action.payload.comment);
      state.hotelData.comments.push(action.payload.comment);
      state.userData.orders[action.payload.index].reviewed = true;
    },
    setHotelData: (state, action) => {
      state.hotelData = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.payment_method = action.payload;
    },
    addOrder: (state, action) => {
      state.userData.orders.push(action.payload);
    },
    updateUser: (state, action) => {
      state.userData.name = action.payload.name;
      state.userData.phone_number = action.payload.phone_number;
    },
    updateStatusOrder: (state, action) => {
      const _id = action.payload._id;
      const status = action.payload.status;
      const index = state.userData.orders.findIndex(order => order._id === _id);
      state.userData.orders[index].status = status;
    },
    setNotification: (state, action) => {
      state.notification.push(action.payload);
    },
    removeNotification: (state, action) => {
      if (action.payload.id === 'all') {
        state.notification = [];
      } else if (action.payload.id !== null) {
        state.notification = state.notification.filter(
          item => item.id !== action.payload.id,
        );
      } else {
        state.notification.shift();
      }
    },
  },
});

export const {
  setUserData,
  setHotels,
  setTheme,
  setUserPosition,
  setBookingDate,
  addComment,
  setHotelData,
  setPaymentMethod,
  addOrder,
  updateUser,
  updateStatusOrder,
  setNotification,
  removeNotification,
} = globalSlice.actions;

export default globalSlice.reducer;

export const NotificationAction = notify => dispatch => {
  dispatch(setNotification(notify));
  setTimeout(() => {
    dispatch(
      removeNotification({
        id: notify.id,
      }),
    );
  }, 5000);
};
