import axios from 'axios';
import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (res.data.status == 'success') location.reload(true);
  } catch (err) {
    showAlert(
      'error',
      'Error logging out! check your internet connection and try again.'
    );
  }
};
