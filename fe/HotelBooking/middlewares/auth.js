import {LOCAL_API_URL} from '@env';

export const CheckLogin = async token => {
  console.log('HOST: ' + LOCAL_API_URL);
  const API = `${LOCAL_API_URL}/auth/checklogin`;
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: token}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {status: 401, data: {message: 'Unauthorized'}, error: error};
  }
};

export const SignIn = async (email, password) => {
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message: 'An error occurred while signing in. Please try again later.',
      },
      error: error,
    };
  }
};

export const CreateSignUp = async (name, phone_number, email, password) => {
  console.log('name: ' + name);
  console.log('phone_number: ' + phone_number);
  console.log('email: ' + email);
  console.log('password: ' + password);
  try {
    const response = await fetch(`${LOCAL_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, phone_number, email, password}),
    });
    const data = await response.json();
    return {status: 200, data: data};
  } catch (error) {
    return {
      status: 401,
      data: {
        message: 'An error occurred while signing up. Please try again later.',
      },
      error: error,
    };
  }
};
