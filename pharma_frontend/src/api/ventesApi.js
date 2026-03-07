import axiosInstance from "./axiosConfig";

/**
 * Récupère l'historique des ventes
 * @param {Object} params - filtrage optionnel (date, statut, page)
 * @returns {Promise<Object>}
 */
export const fetchVentes = async (params = {}) => {
  const response = await axiosInstance.get("/ventes/", { params });
  return response.data;
};

/**
 * Crée une nouvelle vente avec ses lignes
 * @param {Object} data - { notes, lignes: [{ medicament, quantite }] }
 * @returns {Promise<Object>}
 */
export const createVente = async (data) => {
  const response = await axiosInstance.post("/ventes/", data);
  return response.data;
};

/**
 * Annule une vente
 * @param {number|string} id - ID de la vente à annuler
 * @returns {Promise<Object>}
 */
export const annulerVente = async (id) => {
  const response = await axiosInstance.post(`/ventes/${id}/annuler/`);
  return response.data;
};

/**
 * Récupère le détail d'une vente
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const fetchVenteDetail = async (id) => {
  const response = await axiosInstance.get(`/ventes/${id}/`);
  return response.data;
};