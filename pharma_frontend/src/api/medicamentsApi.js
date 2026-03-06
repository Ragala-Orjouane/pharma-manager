import axiosInstance from "./axiosConfig";

// Liste paginée
export const fetchMedicaments = async (params = {}) => {
  const response = await axiosInstance.get("/medicaments/", { params });
  return response.data;
};

// Création
export const createMedicament = async (data) => {
  const response = await axiosInstance.post("/medicaments/", data);
  return response.data;
};

// Modification
export const updateMedicament = async (id, data) => {
  const response = await axiosInstance.put(`/medicaments/${id}/`, data);
  return response.data;
};

// Suppression (soft delete)
export const deleteMedicament = async (id) => {
  const response = await axiosInstance.delete(`/medicaments/${id}/`);
  return response.data;
};

// Médicaments sous stock minimum
export const fetchAlertesMedicaments = async () => {
  const response = await axiosInstance.get("/medicaments/alertes/");
  return response.data;
};