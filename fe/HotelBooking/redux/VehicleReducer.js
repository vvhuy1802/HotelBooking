import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    infoVehicle: null,
};

const VehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        saveInfoVehicle: (state, action) => {
            state.infoVehicle = action.payload;
        },
    },
});

export const {saveInfoVehicle} = VehicleSlice.actions;
export default VehicleSlice.reducer;
