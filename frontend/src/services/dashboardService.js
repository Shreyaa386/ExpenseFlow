import api from "./api";

export const getDashboardData = async (params = {}) => {
  try {
    const response = await api.get("/dashboard", { params });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};