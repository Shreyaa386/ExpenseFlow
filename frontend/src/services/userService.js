import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch("/users/profile", data);
  return response.data;
};

export const updatePreferences = async (data) => {
  const response = await api.patch("/users/preferences", data);
  return response.data;
};