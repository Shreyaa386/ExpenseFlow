import API from "./api";

export const getSplitExpenses = async () => {
  const response = await API.get("/splits");
  return response.data;
};

export const createSplitExpense = async (splitData) => {
  const response = await API.post("/splits", splitData);
  return response.data;
};

export const recordSettlement = async (id, settlementData) => {
  const response = await API.post(`/splits/${id}/settle`, settlementData);
  return response.data;
};

export const deleteSplitExpense = async (id) => {
  const response = await API.delete(`/splits/${id}`);
  return response.data;
};
