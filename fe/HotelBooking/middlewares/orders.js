import {LOCAL_API_URL} from '@env';

export const UpdateReview = async id => {
  const API = `${LOCAL_API_URL}/orders/reviewd/${id}`;
  try {
    const response = await fetch(API, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      message:
        'An error occurred while updating review. Please try again later.',
      error: error,
    };
  }
};
