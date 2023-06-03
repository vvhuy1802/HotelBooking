import {LOCAL_API_URL} from '../../../api';

export const GetAllVehicle = async() => {
  const API = `${LOCAL_API_URL}/vehicle/getallvehicles`;
  try {
    const response = await fetch(API);
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while getting orders. Please try again later.',
      error: error,
    };
  }
};
