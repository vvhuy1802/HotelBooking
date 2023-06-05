import { GET } from "../../../functions/fetchToBE";

export const getAllVehicleInHotel=()=>{
        const path = `/vehicle/getallvehicles`;
        const response = GET(path);
        return response;
}