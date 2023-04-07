import { LOCAL_API_URL } from "../api";

export const GetAllUsers = async () => {
  const API = `${LOCAL_API_URL}/auth/getalluser`;
  try {
    const response = await fetch(API, {
      method: "GET",
    });
    const data = await response.json();
    return { status: 200, data: data };
  } catch (error) {
    return { status: 500, data: error };
  }
};
