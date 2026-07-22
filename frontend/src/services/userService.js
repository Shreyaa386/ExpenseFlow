import api from "./api";

export const updatePreferences = async (data) => {
  const response = await api.patch("/users/preferences", data);
  return response.data;
};