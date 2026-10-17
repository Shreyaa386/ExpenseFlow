import API from "./api";

export const getBudgets = async () => {
  const response = await API.get("/budgets");
  return response.data;
};

export const createBudget = async (budgetData) => {
  const response = await API.post("/budgets", budgetData);
  return response.data;
};

export const updateBudget = async (id, budgetData) => {
  const response = await API.put(`/budgets/${id}`, budgetData);
  return response.data;
};

export const toggleBudget = async (id) => {
  const response = await API.patch(`/budgets/${id}/toggle`);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await API.delete(`/budgets/${id}`);
  return response.data;
};
