import API from "./api";

export const getNotifications = async (params = {}) => {
  const response = await API.get("/notifications", { params });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await API.get("/notifications/unread-count");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markNotificationUnread = async (id) => {
  const response = await API.patch(`/notifications/${id}/unread`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await API.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await API.delete(`/notifications/${id}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await API.delete("/notifications/clear-all");
  return response.data;
};

export const checkBudgetAlerts = async () => {
  const response = await API.post("/notifications/check-alerts");
  return response.data;
};

