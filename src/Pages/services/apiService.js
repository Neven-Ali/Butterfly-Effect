// src/services/apiService.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://daaboul.nasayimhalab.com/api",
});

export const getUserDetails = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await api.get("/account/details/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
