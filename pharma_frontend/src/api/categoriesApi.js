import axiosInstance from "./axiosConfig";

export const getCategories = async () => {
  const response = await axiosInstance.get("/categories/");
  return response.data.results || response.data;
};

export const createCategory = async (data) => {
  const response = await axiosInstance.post("/categories/", data);
  return response.data;
};