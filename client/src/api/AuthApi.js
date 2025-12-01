// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // change if needed

// Get logged-in user profile
export const getProfile = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Update profile
export const updateProfile = async (token, profileData) => {
  try {
    const res = await axios.put(`${API_URL}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// Upload avatar
export const uploadAvatar = async (token, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.post(`${API_URL}/profile/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return { success: false, message: err.response?.data?.message || err.message };
  }
};
