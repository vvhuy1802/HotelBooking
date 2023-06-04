import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    infoVehicle: null,
    idHotel: null,
};

const VehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        saveInfoVehicle: (state, action) => {
            state.infoVehicle = action.payload;
        },
        clearInfoVehicle: (state) => {
            state.infoVehicle = null;
        },
        saveIdHotel: (state, action) => {
            state.idHotel = action.payload;
        }
    },
});

export const {saveInfoVehicle,clearInfoVehicle,saveIdHotel} = VehicleSlice.actions;
export default VehicleSlice.reducer;
