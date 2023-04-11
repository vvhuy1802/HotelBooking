import { GET } from "../functions/fetchToBE";

export const GetAllUsers = async () => {
  const path = `/auth/getalluser`;
  const response = await GET(path);
  return response;
};
