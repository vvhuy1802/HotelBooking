import { GET, POST } from "../functions/fetchToBE";

export const GetAllHotels = async () => {
  const path = `/hotels/getall`;
  const response = await GET(path);
  return response;
};

export const GetSingleHotel = async (id) => {
  const path = `/hotels/getbyid/${id}`;
  const response = await GET(path);
  return response;
};

export const CreateHotel = async (data) => {
  const path = `/hotels/addnewhotel`;
  const response = await POST(path, data);
  return response;
};
