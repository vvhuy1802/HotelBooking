import {GET, POST} from '../../../functions/fetchToBE';

export const GetAllOrders = async () => {
  const path = `/orders/getallorders`;
  const response = await GET(path);
  return response;
};

export const AddNewVehicleInHotel = (data) => {
        const res = POST("/vehicle/addnewvehicle", data);
}
