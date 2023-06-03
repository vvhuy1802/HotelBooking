import { POST } from "../functions/fetchToBE";

export const SendMessage = async (data) => {
  const path = `/messages/sendmsg`;
  const response = await POST(path, data);
  return response;
};

export const RecieveMessage = async (data) => {
  const path = `/messages/getmsg`;
  const response = await POST(path, data);
  return response;
};
