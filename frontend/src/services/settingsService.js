import api from "./api";

export const updateTheme = async (theme) => {
  const response = await api.patch("/users/theme", {
    theme,
  });

  return response.data;
};

export const updateNotifications = async (notifications) => {
  const response = await api.patch(
    "/users/notifications",
    notifications
  );

  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await api.patch(
    "/users/change-password",
    passwords
  );

  return response.data;
};