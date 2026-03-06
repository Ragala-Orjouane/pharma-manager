import { useQuery } from "react-query";
import { fetchMedicaments } from "../api/medicamentsApi";

export const useMedicaments = (filters = {}) => {
  return useQuery(["medicaments", filters], () => fetchMedicaments(filters));
};