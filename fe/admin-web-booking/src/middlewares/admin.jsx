import { GET } from "../functions/fetchToBE";

export const GetAllAdmins = async () => {
  const path = `/admins/getall`;
  const response = await GET(path);
  return response;
};

export const GetSingleAdmin = async (id) => {
  const path = `/admins/${id}`;
  const response = await GET(path);
  return response;
};
