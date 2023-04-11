import { GET } from "../functions/fetchToBE";

export const GetAllHotels = async () => {
  const path = `/hotels/getall`;
  const response = await GET(path);
  return response;
};