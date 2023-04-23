import { GET } from "../functions/fetchToBE";

export const GetAllUsers = async () => {
  const path = `/auth/getalluser`;
  const response = await GET(path);
  return response;
};

export const GetSingleUser = async (id) => {
  const path = `/auth/getuser/${id}`;
  const response = await GET(path);
  return response;
};
